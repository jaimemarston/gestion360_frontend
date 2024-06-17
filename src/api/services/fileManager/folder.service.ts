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

const updateFolder = async (folderId: number, label1: string, label2: string, label3: string) => {
    const { data } = await http.patch(`/folders/${folderId}`, {label1, label2, label3})
    return data
}

const deleteFolder = async (folderId: number) => {
    const { data } = await http.delete(`/folders/${folderId}`)
    return data
}

export default {
    getAllFolder,
    createFolder,
    updateFolder,
    deleteFolder
}