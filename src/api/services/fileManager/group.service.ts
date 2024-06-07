import http from '../axios'

const getAllGroups = async () => {
    const { data } = await http.get('/groups')

    return data
}

const createGroup = async (group: { name: string }) => {
    const { data } = await http.post('/groups', group)
    return data
}


export default {
    getAllGroups,
    createGroup
}