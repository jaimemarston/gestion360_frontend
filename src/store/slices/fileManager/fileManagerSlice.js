import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import folderService from '../../../api/services/fileManager/folder.service';
import groupService from '../../../api/services/fileManager/group.service';

const initialState = {
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
    async (_, thunkAPI) => {
        const response = await groupService.getAllGroups();

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

export const addFolder = createAsyncThunk(
    'FileManagerSlice/addFolder',
    async (folder, thunkAPI) => {
        const response = await folderService.createFolder(removeEmptyStringProperties(folder));

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


    },
});

export const { getGroups } = FileManagerSlice.actions;
