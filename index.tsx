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
