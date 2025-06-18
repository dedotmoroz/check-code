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
            transformResponse: (response: Entities.INotesList) => {
                return notesListAdapter.upsertMany(
                    notesListAdapter.getInitialState({
                        total: response.total,
                        limit: response.limit,
                        offset: response.offset,
                    }), mapNoteListDtoToEntity(response.content)
                );
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



        getNoteListPaged: build.query<Dtos.INoteList, Entities.INotesListPage>({
  query: ({ folderId, offset, limit, excludeFolders }) => ({
    url: `/api/service-notes/api/v6/notes/list/paged`,
    method: 'GET',
    params: { ...(folderId && { folderId }), offset, limit, excludeFolders },
  }),

  serializeQueryArgs: ({ queryArgs }) => {
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

  transformResponse: (response: Entities.INotesList): Dtos.INoteList => {
    // Нормализуем данные с помощью адаптера
    return notesListAdapter.setAll(
      notesListAdapter.getInitialState({
        total: response.total,
        limit: response.limit,
        offset: response.offset
      }),
      response.content
    );
  },

  merge: (currentCache, newValue) => {
    // Добавляем новые записи к существующим
    notesListAdapter.upsertMany(
      currentCache,
      Object.values(newValue.entities)
    );

    // Обновляем мета-данные
    currentCache.total = newValue.total;
    currentCache.limit = newValue.limit;
    currentCache.offset = newValue.offset;
  },

  forceRefetch({ currentArg, previousArg }) {
    if (currentArg?.offset !== undefined && previousArg?.offset !== undefined) {
      return currentArg.offset > previousArg.offset;
    }
    return false;
  },
}),

    })
});



        /**
         * Удаление заметки
         */
        deleteNote: build.mutation<void, IDeleteNote>({
            query: ({ id, parentId }) => ({
                url: `/api/service-notes/api/v6/notes/note/${id}`,
                method: 'DELETE',
            }),
            onQueryStarted: async (data, { dispatch, queryFulfilled }) => {
                await queryFulfilled;
                /*** Удаление из выбранной папки */
                dispatch(
                    ServiceNotes.util.updateQueryData(
                        'getNoteListPaged',
                        { folderId: data.parentId ? data.parentId : 'excludeFolders' },
                        (draftNotes) => {
                            draftNotes.total -= 1;
                            draftNotes.entities = getDelFolderNotes({
                                id: data.id,
                                notesState: draftNotes.entities,
                            });
                        },
                    ),
                );
                /*** Удаление из папки Все заметки */
                dispatch(
                    ServiceNotes.util.updateQueryData(
                        'getNoteListPaged',
                        { folderId: 'allNotesFolder' },
                        (draftNotes) => {
                            draftNotes.total -= 1;
                            draftNotes.entities = getDelFolderNotes({
                                id: data.id,
                                notesState: draftNotes.entities,
                            });
                        },
                    ),
                );
            },
        }),



            deleteNote: build.mutation<void, IDeleteNote>({
  query: ({ id }) => ({
    url: `/api/service-notes/api/v6/notes/note/${id}`,
    method: 'DELETE',
  }),

  onQueryStarted: async (data, { dispatch, queryFulfilled }) => {
    await queryFulfilled;

    /*** Удаление из выбранной папки */
    dispatch(
      ServiceNotes.util.updateQueryData(
        'getNoteListPaged',
        { folderId: data.parentId ? data.parentId : 'excludeFolders' },
        (draftNotes) => {
          notesListAdapter.removeOne(draftNotes, data.id);
          draftNotes.total = Math.max((draftNotes.total ?? 1) - 1, 0);
        }
      )
    );

    /*** Удаление из папки Все заметки */
    dispatch(
      ServiceNotes.util.updateQueryData(
        'getNoteListPaged',
        { folderId: 'allNotesFolder' },
        (draftNotes) => {
          notesListAdapter.removeOne(draftNotes, data.id);
          draftNotes.total = Math.max((draftNotes.total ?? 1) - 1, 0);
        }
      )
    );
  }
}),


            listenerMiddleware.startListening({
  actionCreator: ServiceNotes.endpoints.deleteNote.matchFulfilled,
  effect: async (action, { dispatch }) => {
    const { id, parentId } = action.meta.arg;

    const targets = [
      parentId ? parentId : 'excludeFolders',
      'allNotesFolder'
    ];

    for (const folderKey of targets) {
      dispatch(
        ServiceNotes.util.updateQueryData(
          'getNoteListPaged',
          { folderId: folderKey },
          (draftNotes) => {
            notesListAdapter.removeOne(draftNotes, id);
            draftNotes.total = Math.max((draftNotes.total ?? 1) - 1, 0);
          }
        )
      );
    }
  }
});
