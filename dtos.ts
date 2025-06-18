import { EntityState } from '@reduxjs/toolkit';

import { Op } from 'quill-delta';

// Folders

// export type IFolderObj = Record<
//     string,
//     {
//         id: string;
//         name: string;
//         parentId?: string;
//     }
// >;

// export interface IFoldersList {
//     version?: number;
//     folders: IFolderObj;
// }

/***********
 * Folders DTOs
 ***********/

interface IFolder {
    id: string;
    name: string;
    parentId?: string;
}

export interface IFoldersList extends EntityState<IFolder, IFolder['id']> {
    version?: number;
}

/*********
 * Notes DTOs
 *********/

export interface INoteListItem {
    id: string;
    title: string;
    text?: string;
    parentId?: string;
    version?: number;
    updatedAt?: string;
    autoProtocolId?: IAutoProtocolId;
    leadingNote: string;
}

export interface INoteList extends EntityState<INoteListItem, INoteListItem['id']> {
    total?: number;
    limit?: number;
    offset?: number;
}


export type IAutoProtocolId = string;

interface sharedNote {
    employeeId: string;
    lastShareDate: string;
}

interface INoteResponse {
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
    autoProtocolId?: IAutoProtocolId;
    sharedEmployeeId?: string;
    shared?: sharedNote[];
    leadingNote: string;
}

export interface INoteResponseDto extends INoteResponse {
    blockedEditor?: boolean;
    selectedTitle?: string;
    selectedDescription?: string;
}
