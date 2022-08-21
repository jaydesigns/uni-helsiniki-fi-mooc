import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const req = axios.get(baseUrl)
    return req.then(response => response.data)
}
const create = newObject => {
    const req = axios.post(baseUrl, newObject)
    return req.then(response => response.data)
}
const removeContact = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`)
    return req.then(response=>response.data)
}

// eslint-disable-next-line
export default {getAll, create, removeContact}