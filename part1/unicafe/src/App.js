import { useState } from 'react'

const Button = ({ setFeedback, text }) => (
	<button onClick={setFeedback}>
		{text}
	</button>
)

const StatisticLine = ({ text, value }) => (
	
	// It is wrong to declare <table></table> tags here because 
	// everytime when StatisticLine Component gets called, it gets rerendered,
	// causing table tags to rerender which destroys the table layout.
	
	<tr>
		<td>{text}</td>
		<td>{value}</td>
	</tr>
)

const Statistics = (props) => {
	if (props.all === 0) {
		return (
			<div>
				No feedback given
			</div>
		) 
	}
	return (
		
	// The content of every table is enclosed by <table></table>
	// We need to use thead/tbody when we use table element in react.js
	// I thought we only needed to create table layout in the StatisticLine
	// component that props are passed thorough. However, this wasn't true.
	// We first need to initialize <table> element in the Statistics Component
	// that forms the basis of its structure.
	// And then we pass through its data by props into the StatisticLine Component
	// which further organize it with its <tr> and <td> tags.
		
		<table>
			<tbody>
				<StatisticLine text="good" value={props.good} />
				<StatisticLine text="neutral" value={props.neutral} />
				<StatisticLine text="bad" value={props.bad} />
				<StatisticLine text="all" value={props.all} />
				<StatisticLine text="average" value={props.average} />
				<StatisticLine text="positive" value={props.positive} />
			</tbody>
		</table>		
	)
	
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const handleGood = () => setGood(good +1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)
  const all = good + neutral + bad
  const totalScore = good * 1 + bad * -1
  
  const average = () => {
	  if (all === 0) {
		  return 0
	  }
	  return totalScore / all
  }
  
  const positive = () => {
	  if (all === 0) {
		  return 0
	  }
	  return (good / all) * 100 + " %"
  } 
  
  return (
    <div>
      <h1>give feedback</h1>
	  <Button setFeedback={handleGood} text="good" />
	  <Button setFeedback={handleNeutral} text="neutral" />
	  <Button setFeedback={handleBad} text="bad" />	
	  <h1>statistics</h1>
	  <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average()} positive={positive()} />
    </div>
  )
}

export default App