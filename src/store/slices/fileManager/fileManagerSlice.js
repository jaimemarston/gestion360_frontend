import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import folderService from '../../../api/services/fileManager/folder.service';
import groupService from '../../../api/services/fileManager/group.service';
import fileService from '../../../api/services/fileManager/file.service';

const initialState = {
    isLoadingFile: false,
    isLoading: false,
    groups: [],
    folders: [],
    files: [],
};

function removeEmptyStringProperties(obj) {
    for (let prop in obj) {
        if (typeof obj[prop] === 'string' && obj[prop].trim() === '') {
            delete obj[prop];
        } else if (typeof obj[prop] === 'object') {
            removeEmptyStringProperties(obj[prop]);
        }
    }
    return obj;
}

export const fetchGroups = createAsyncThunk(
    'FileManagerSlice/fetchGroups',
    async (data, thunkAPI) => {

        const { year } = data

        const response = await groupService.getAllGroups(year);

        return response;
    }
);

export const addGroup = createAsyncThunk(
    'FileManagerSlice/addGroup',
    async (group, thunkAPI) => {


        const response = await groupService.createGroup(removeEmptyStringProperties(group));

        thunkAPI.dispatch(fetchGroups());
        return response;
    }
);

export const fetchFiles = createAsyncThunk(
    'FileManagerSlice/fetchFile',
    async (folderId, thunkAPI) => {

        const { idFolder, rowsPerPage, page } = folderId;

        const response = await fileService.getFileFolder(idFolder, rowsPerPage, page );

        return response;
    }
);

export const groupEdit = createAsyncThunk(
    'FileManagerSlice/groupEdit',
    async ( group, thunkAPI) => {

        const { id, ...data } = group;

        const response = await groupService.editGroup(data, id);

        thunkAPI.dispatch(fetchGroups());
        return response;
    }
);

export const removeGroup = createAsyncThunk(
    'FileManagerSlice/removeGroup',
    async ( data, thunkAPI) => {

        const { id } = data;

        const response = await groupService.deleteGroup(id);

        thunkAPI.dispatch(fetchGroups());
        return response;
    }
);

export const addFile = createAsyncThunk(
    'FileManagerSlice/addFile',
    async ( files, thunkAPI) => {

        const { idFolder, ...formattedFiles } = files;

        const response = await fileService.createFile(idFolder, formattedFiles);

        thunkAPI.dispatch(fetchFiles());
        thunkAPI.dispatch(fetchGroups());
        return response;
    }
);

export const addMetadata = createAsyncThunk(
    'FileManagerSlice/addFile',
    async ( file, thunkAPI) => {

        const { idFile, ...dataFile } = file;

        const response = await fileService.createMetadata(idFile, dataFile);

        thunkAPI.dispatch(fetchFiles());
        thunkAPI.dispatch(fetchGroups());
        return response;
    }
);

export const removeFile = createAsyncThunk(
    'FileManagerSlice/removeFile',
    async ( files, thunkAPI) => {

        const { idFolder, idFile } = files;

        const response = await fileService.deleteFile(idFolder, idFile);

        return response;
    }
);

export const addFolder = createAsyncThunk(
    'FileManagerSlice/addFolder',
    async (folder, thunkAPI) => {
        const response = await folderService.createFolder(folder);
        thunkAPI.dispatch(fetchGroups());

        return response;
    }
);

export const editFolder = createAsyncThunk(
    'FileManagerSlice/editFolder',
    async (folder, thunkAPI) => {

        const {label, folderId} = folder;

        const response = await folderService.updateFolder(folderId, label);
        thunkAPI.dispatch(fetchGroups());

        return response;
    }
);

export const removeFolder = createAsyncThunk(
    'FileManagerSlice/removeFolder',
    async (idFolder, thunkAPI) => {

        const {folderId} = idFolder;

        const response = await folderService.deleteFolder(folderId);

        thunkAPI.dispatch(fetchGroups());

        return response;
    }
);

export const updateGroup = createAsyncThunk(
    'FileManagerSlice/updateGroup',
    async (group, thunkAPI) => {
        const response = await groupService.createGroup(removeEmptyStringProperties(group));

        thunkAPI.dispatch(fetchGroups());
        return response;
    }
);

export const updateFolder = createAsyncThunk(
    'FileManagerSlice/updateFolder',
    async (folder, thunkAPI) => {
        const response = await folderService.createFolder(removeEmptyStringProperties(folder));

        thunkAPI.dispatch(fetchGroups());

        return response;
    }
);

export const FileManagerSlice = createSlice({
    name: 'FileManagerSlice',
    initialState,
    reducers: {
        getGroups: (state) => {
            return state.groups;
        },
        getFolders: (state) => {
            return state.folders;
        },
        getFiles: (state) => {
            return state.files;
        }
    },
    extraReducers: (builder) => {

        // addgroup loading handling
        builder
            .addCase(addGroup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addGroup.rejected, (state, action) => {
                state.isLoading = false;
            });

        // addfolder loading handling
        builder
            .addCase(addFolder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addFolder.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addFolder.rejected, (state, action) => {
                state.isLoading = false;
            });


        // fetchgroups loading handling
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.groups = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.isLoading = false;
            });

        builder
        .addCase(fetchFiles.pending, (state) => {
            state.isLoadingFile = true;
        })
        .addCase(fetchFiles.fulfilled, (state, action) => {
            state.files = action.payload;
            state.isLoadingFile = false;
        })
        .addCase(fetchFiles.rejected, (state, action) => {
            state.isLoadingFile = false;
        });

    },
});

export const { getGroups, getFiles } = FileManagerSlice.actions;
