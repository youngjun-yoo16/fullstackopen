import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  const object = { content, votes: 0 };
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const updateOne = async (id) => {
  const endpoint = `${baseUrl}/${id}`;
  // Fetch the specific anecdote by its ID
  const { data: anecdoteToChange } = await axios.get(endpoint);
  // Update the votes
  const changedAnecdote = {
    ...anecdoteToChange,
    votes: anecdoteToChange.votes + 1,
  };
  // Send the PUT request with the updated anecdote
  const response = await axios.put(endpoint, changedAnecdote);

  return response.data;
};

export default { getAll, createNew, updateOne };
