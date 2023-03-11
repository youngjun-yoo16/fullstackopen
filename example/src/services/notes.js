import axios from 'axios'
const baseUrl = 'https://json-sever-dev.run.goorm.site/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(poop => poop.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}