import axios from 'axios'
const baseUrl = 'https://json-sever-dev.run.goorm.site/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, remove }