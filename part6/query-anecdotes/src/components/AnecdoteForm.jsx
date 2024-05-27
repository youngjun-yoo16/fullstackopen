import { QueryClient, useMutation } from "@tanstack/react-query";
import { createAnecdote } from "../requests";
import { useNotificationDispatch } from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = new QueryClient();
  const notificationDispatch = useNotificationDispatch();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onError: (error) => {
          notificationDispatch({
            type: "SET_NOTIFICATION",
            data: { notification: error.response.data.error },
          });
          setTimeout(() => {
            notificationDispatch({ type: "REMOVE_NOTIFICATION" });
          }, 5000);
        },
      }
    );
    notificationDispatch({
      type: "SET_NOTIFICATION",
      data: { notification: `anecdote '${content}' created` },
    });
    setTimeout(() => {
      notificationDispatch({ type: "REMOVE_NOTIFICATION" });
    }, 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
