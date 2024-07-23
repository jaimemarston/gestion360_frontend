import http from '../axios'


const getAllUsersGroups = async () => {
    const { data } = await http.get(`/usergroups`)
    return data
}

const createUsersGroup = async (group: { name: string }) => {
    const { data } = await http.post('/usergroups', group)
    return data
}

const addUsersGroup = async (id: string | number, group: { users: number[] }) => {
    const { data } = await http.post(`/usergroups/${id}/addUsers`, group)
    return data
}

const getUsersFromAGroupUser = async (groupId: number) => {
    const { data } = await http.get(`/usuario?usergroupId=${groupId}`)
    return data
}

const unassignUsersFromUserGroups = async (id: string | number, group: { users: number[] }) => {
    const { data } = await http.post(`/usergroups/${id}/removeUsers`, group)
    return data
}

export default { createUsersGroup , getAllUsersGroups, addUsersGroup, getUsersFromAGroupUser, unassignUsersFromUserGroups }