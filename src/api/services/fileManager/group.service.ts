import http from '../axios'

const getAllGroups = async (year: string = '') => {
    const { data } = await http.get(`/groups?year=${year}`)

    return data
}

const createGroup = async (group: { name: string }) => {
    const { data } = await http.post('/groups', group)
    return data
}

const editGroup = async ( group: { name: string }, id: number ) => {
    const { data } = await http.patch(`/groups/${id}`, group)
    return data
}

const deleteGroup = async ( idGroup: number ) => {
    const { data } = await http.delete(`/groups/${idGroup}`)
    return data
}

export default {
    getAllGroups,
    createGroup,
    editGroup,
    deleteGroup
}