import {EmptySplitApi} from 'shared/api';

import * as Entities from './entities';
import * as Mappers from './mappers';
import * as Dtos from './dtos';
import {foldersListAdapter} from "./entities";

export const ServiceNotes = EmptySplitApi.injectEndpoints({
    endpoints: (build) => ({

        /***********
         * Folders *
         ***********
         *
         * Получение списка папок
         */
        getFoldersList: build.query<Dtos.IFoldersList, void>({
            query: () => ({
                url: `/api/service-note-sync/api/v1/folders`,
                method: 'GET',
            }),
            transformResponse: (foldersList: Entities.IFoldersList): Dtos.IFoldersList => {
                return foldersListAdapter.setAll(
                    foldersListAdapter.getInitialState({version: foldersList.version}), foldersList.folders
                );
            },
        }),

        /**
         * Создание, изменение, удаление папки
         */
        manageFolder: build.mutation<Dtos.IFoldersList, Entities.IManageFoldersList>({
            query: ({ version, folders, deletedFolderId }) => ({
                url: `/api/service-note-sync/api/v2/folders`,
                method: 'POST',
                body: { version, folders },
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                const patchResult = dispatch(
                    ServiceNotes.util.updateQueryData('getFoldersList', undefined, (draft) => {
                        const foldersObj = data.folders.reduce((acc, folder) => {
                            return { ...acc, [folder.id]: folder };
                        }, {});
                        draft.version = data.version;
                        draft.folders = foldersObj;
                    }),
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),


       getNoteListPaged: build.query<Dtos.INoteList, Entities.INotesListPage>({
            query: ({ folderId, offset, limit, excludeFolders }) => ({
                url: `/api/service-notes/api/v6/notes/list/paged`,
                method: 'GET',
                params: { ...(folderId && { folderId }), offset, limit, excludeFolders },
            }),
            transformResponse: (response: Entities.INotesList) => {
                return notesListAdapter.upsertMany(
                    notesListAdapter.getInitialState({
                        total: response.total,
                        limit: response.limit,
                        offset: response.offset,
                    }), response.content
                );
            },
            serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
                let sliceName = '';
                switch (true) {
                    case !queryArgs.folderId && queryArgs.excludeFolders:
                        sliceName = 'excludeFolders';
                        break;
                    case !queryArgs.folderId:
                        sliceName = 'allNotesFolder';
                        break;
                    default:
                        sliceName = queryArgs.folderId;
                        break;
                }
                return `getNoteListPaged(${sliceName})`;
            },
            merge: (currentCache, newValue) => {
                currentCache.content = { ...currentCache.content, ...newValue.content };
                currentCache.total = newValue.total;
                currentCache.offset = newValue.offset;
            },
            forceRefetch({ currentArg, previousArg }) {
                if (currentArg?.offset !== undefined && previousArg?.offset !== undefined) {
                    if (currentArg.offset > previousArg.offset) return true;
                }
                return false;
            },
        }),


        /**
         * Получение полной заметка
         */
        getNote: build.query<Dtos.INoteResponseDto, string>({
            query: (id) => ({
                url: `/api/service-notes/api/v6/notes/note/${id}`,
                method: 'GET',
            }),
            transformResponse: (note: Entities.INoteResponse): Dtos.INoteResponseDto => {
                return Mappers.mapNoteDtoToEntity(note);
            },
        }),

    })
});
