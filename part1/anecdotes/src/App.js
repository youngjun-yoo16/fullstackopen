import { useState } from 'react';

const Button = ({ action, text }) => <button onClick={action}>{text}</button>;

const Display = ({ data }) => <p>{data}</p>;

const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.',
    ];

    const votes = Array(8).fill(0);
    const [points, setPoints] = useState(votes);
    const [selected, setSelected] = useState(0);

    const getRandomInt = () => {
        //Getting a random integer between two values, inclusive
        //The maximum is inclusive and the minimum is inclusive
        setSelected(Math.floor(Math.random() * (7 - 0 + 1) + 0));
    };

    //https://dev.to/andyrewlee/cheat-sheet-for-updating-objects-and-arrays-in-react-state-48np
    const updateVote = () => {
        const copy = [...points];
        copy[selected] += 1;
        setPoints(copy);
    };

    //https://bobbyhadz.com/blog/javascript-get-index-of-max-value-in-array
    const mostVote = () => {
        const max = Math.max(...points);
        const index = points.indexOf(max);
        return index;
    };

    return (
        <div>
            <h2>Anecdote of the day</h2>
            <Display data={anecdotes[selected]} />
            <p>has {points[selected]} votes</p>
            <Button action={updateVote} text="vote" />
            <Button action={getRandomInt} text="next anecdote" />
            <h2>Anecdote with most votes</h2>
            <Display data={anecdotes[mostVote()]} />
            <p>has {points[mostVote()]} votes</p>
        </div>
    );
};

export default App;