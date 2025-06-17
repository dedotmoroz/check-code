import { Op } from 'quill-delta';

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

export type IFolderObj = Record<
    string,
    {
        id: string;
        name: string;
        parentId?: string;
    }
>;

// export interface IFoldersList {
//     version?: number;
//     folders: IFolderObj;
// }

export interface IFoldersList {
    version?: number;
    ids?: string[]
    entities?: IFolderObj;
}
