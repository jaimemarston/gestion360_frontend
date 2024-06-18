import http from '../axios'

type Files = { mimetype: string, filename: string, base64Content: string, tags: string[] }

const getFileFolder = async (folderId, rowsPerPage, page) => {
    const { data } = await http.get(`minio/get-files-by-folder/${folderId}?per_page=${rowsPerPage}&page=${page}`)

    return data
}

const createFile = async (idFolder, files: Files) => {
    const { data } = await http.post(`minio/${idFolder}/bulk-upload`, files)
    return data
}

const deleteFile = async (idFolder, fileId) => {
    const { data } = await http.delete(`minio/${idFolder}/${fileId}`)
    return data
}

export default {
    getFileFolder,
    createFile,
    deleteFile
}