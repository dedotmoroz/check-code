import {createEntityAdapter, EntityState} from '@reduxjs/toolkit';

import { Op } from 'quill-delta';
import {IParticipant, IProjectItem} from "../projects";
import {IFolder} from "./types";

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

export interface IFoldersList {
    version?: number;
    folders: {
        id: string;
        name: string;
        parentId?: string;
    }[];
}

export interface IManageFoldersList {
    version?: number;
    deletedFolderId?: string;
    folders: IFolder[];
}

export const foldersListAdapter = createEntityAdapter<IFoldersList['folders']>();
export interface IFoldersList extends EntityState<IProjectItem, IProjectItem['code']> {}
