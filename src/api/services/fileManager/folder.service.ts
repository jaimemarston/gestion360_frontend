import http from '../axios'

type Folder = {
    label: string, // Required
    groupId: number | null, 
    parent: number | null, // ID || null
    user_ids: number[] | null
}

const getAllFolder = async () => {
    const { data } = await http.get('/folders')

    return data
}

const createFolder = async (folder: Folder) => {
    const { data } = await http.post('/folders', folder)
    return data
}

const updateFolder = async (folderId: number, label:string) => {
    const { data } = await http.patch(`/folders/${folderId}`, {label})
    return data
}

const deleteFolder = async (folderId: number) => {
    const { data } = await http.delete(`/folders/${folderId}`)
    return data
}

const assignUsersToaFolder = async (folderId: number, user_ids: number[], usergroups_ids: number[] ) =>{
    const { data } = await http.post(`/folders/add-user/${folderId}`, {user_ids, usergroups_ids}) 
    return data;
}

const usersAssignToaFolder = async (folderId: number) =>{
    const { data } = await http.get(`/usuario?folderId=${folderId}`) 
    return data;
}

const gruoupsUsersAssignToaFolder = async (folderId: number) =>{
    const { data } = await http.get(`/usergroups?folderId=${folderId}`) 
    return data;
}

export default {
    getAllFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    assignUsersToaFolder,
    usersAssignToaFolder,
    gruoupsUsersAssignToaFolder,
}