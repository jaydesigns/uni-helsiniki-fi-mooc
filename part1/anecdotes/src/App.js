import { useState } from "react";

const Button = ({handler,text}) => {
  return(
    <button onClick={handler}>{text}</button>
  )
}

const Anecdote = (props) => {
  return(
    <p>{props.text}</p>
  )
}

const App = () => {
  const n = 7
  const [votes,setVotes] = useState(Array(n).fill(0))

  const handleVote =() => {
    const voteCopy = [...votes]
    voteCopy[selected] += 1
    setVotes(voteCopy)
  }

  const mostPopular = () => {
    return(
      anecdotes[votes.indexOf(Math.max(...votes))]
    )
  }

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]

  const [selected, setSelected] = useState(0)

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <Anecdote text={anecdotes[selected]} />
      <p>This has {votes[selected]} votes</p>
      <Button handler={()=>{setSelected(Math.floor(Math.random()*anecdotes.length))}} text='next anecdote'/>
      <Button handler={handleVote} text='vote'/>
      <h1>Anecdote with the most votes</h1>
      <Anecdote text={mostPopular()} />
      <p>This is the anecdote with the most votes with {Math.max(...votes)} votes.</p>
    </div>
  );
}

export default App;
