import * as Entities from './entities';
import * as Dtos from './dtos';

export function mapNoteDtoToEntity(note: Entities.INoteResponse): Dtos.INoteResponseDto {
    const { title } = note;

    return {
        ...note,
        blockedEditor: false,
        selectedTitle: title,
        selectedDescription: '',
    };
}

export function mapFoldersListDtoToEntity(foldersList: Entities.IFoldersList): Dtos.IFoldersList {
    const foldersObj = foldersList.folders.reduce((acc, folder) => {
        return { ...acc, [folder.id]: folder };
    }, {});
    return {
        version: foldersList.version,
        folders: foldersObj,
    };
}
