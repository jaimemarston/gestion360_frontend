import http from '../axios'

type Folder = {
    label1: string,
    label2: string,
    label3: string,
}

const getAllFolder = async () => {
    const { data } = await http.get('/folders')

    return data
}

const createFolder = async (folder: Folder) => {
    const { data } = await http.post('/folders', folder)
    return data
}


export default {
    getAllFolder,
    createFolder
}