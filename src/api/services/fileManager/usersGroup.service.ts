import http from '../axios'
/* 
export const getAllGroups = async (year: string = '') => {
    const { data } = await http.get(`/groups?year=${year}`)

    return data
} */

const createUsersGroup = async (group: { name: string }) => {
    const { data } = await http.post('/usergroups', group)
    return data
}

/* export const editGroup = async ( group: { name: string }, id: number ) => {
    const { data } = await http.patch(`/groups/${id}`, group)
    return data
} */

export default { createUsersGroup }