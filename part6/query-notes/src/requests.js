import axios from "axios";

export const getNotes = () => {
  return axios.get("http://localhost:3001/notes").then((res) => res.data);
};
