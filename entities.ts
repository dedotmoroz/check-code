import {createEntityAdapter} from '@reduxjs/toolkit';

import { Op } from 'quill-delta';

/***********
 * Folders Entities
 ***********/

export interface IFolder {
    id: string;
    name: string;
    parentId?: string;
}

export interface IFoldersList {
    version?: number;
    folders: IFolder[];
}

export interface IManageFoldersList extends IFoldersList{
    deletedFolderId?: string;
}

export const foldersListAdapter = createEntityAdapter<IFolder>();

// export interface IFoldersList extends EntityState<IProjectItem, IProjectItem['code']> {}

/*********
 * Notes Entities
 *********/

export interface INotesListPage {
    folderId: string;
    limit?: number;
    offset?: number;
    excludeFolders?: boolean;
}

export interface INoteListItem {
    id: string;
    title: string;
    text?: string;
    parentId?: string;
    version?: number;
    updatedAt?: string;
    autoProtocolId?: string;
    leadingNote: string;
}

export interface INotesList {
    offset: number;
    limit: number;
    total: number;
    content: Record<INoteListItem['id'], INoteListItem>;
}

export const notesListAdapter = createEntityAdapter<INoteListItem>();

interface sharedNote {
    employeeId: string;
    lastShareDate: string;
}

export interface INoteResponse {
    id: string;
    title: string;
    tags?: string[];
    text?: string;
    delta?: Op[];
    textRTF?: string;
    createdAt?: string;
    updatedAt?: string;
    deleteAt?: string;
    meeting?: {
        id?: string;
        title?: string;
        date?: string;
    };
    parentId?: string;
    version?: number;
    autoProtocolId?: string;
    sharedEmployeeId?: string;
    shared?: sharedNote[];
    leadingNote: string;
}
