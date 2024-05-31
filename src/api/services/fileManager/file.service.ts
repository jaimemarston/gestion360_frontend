import http from '../axios'

const getFileFolder = async (id) => {
    const { data } = await http.get(`/api/minio/${id}/bulk-upload`)

    return data
}

const createFile = async (group: { mimetype: string, filename: string, base64Content: string, tags: string[] }) => {
    const { data } = await http.post('/groups', group)
    return data
}

export default {
    getFileFolder,
    createFile
}