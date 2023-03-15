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

const update = (id, newObject) => {
  /* If we just put new number as a request along with the url, the json-server won't be able to
  correctly store it. Since PUT request entirely replace the object of specified id, we need to 
  follow the correct format of name, number, and id as keys along with their corresponding value. 
  
  For example: When we only provide the new number (99999999999) as a request:
  
  "99999999999": "",
  "id": 5
  
  Such thing happens.*/
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }