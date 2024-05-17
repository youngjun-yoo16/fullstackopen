import { useSelector, useDispatch } from "react-redux";
import { upvoteAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationByUpvote } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter === "ALL") {
      return anecdotes;
    }
    return anecdotes.filter((anecdotes) => anecdotes.content.includes(filter));
  });
  const dispatch = useDispatch();

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => {
                dispatch(upvoteAnecdote(anecdote.id));
                dispatch(setNotificationByUpvote(anecdote.content));
              }}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
