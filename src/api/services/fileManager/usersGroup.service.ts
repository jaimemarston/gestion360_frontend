import http from '../axios'


const getAllUsersGroups = async () => {
    const { data } = await http.get(`/usergroups`)
    return data
}

const createUsersGroup = async (group: { name: string }) => {
    const { data } = await http.post('/usergroups', group)
    return data
}

export default { createUsersGroup , getAllUsersGroups}