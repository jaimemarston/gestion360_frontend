import http from '../axios'

type Files = { mimetype: string, filename: string, base64Content: string, tags: string[] }

const getFileFolder = async (id) => {
    const { data } = await http.get(`minio/${id}/bulk-upload`)

    return data
}

const createFile = async (idFolder, files: Files) => {
    const { data } = await http.post(`minio/${idFolder}/bulk-upload`, files)
    return data
}

export default {
    getFileFolder,
    createFile
}