import { useState } from 'react'

const Button = (props) => (
	<button onClick={props.setFeedback}>
		{props.text}
	</button>
)

const StatisticLine = (props) => (
	<div>
		<p>{props.text} {props.value}</p>
	</div>
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
		<div>
			<StatisticLine text="good" value={props.good} />
			<StatisticLine text="neutral" value={props.neutral} />
			<StatisticLine text="bad" value={props.bad} />
			<StatisticLine text="all" value={props.all} />
			<StatisticLine text="average" value={props.average} />
			<StatisticLine text="positive" value={props.positive} />
		</div>		
	)
	
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const handleGood = () => {
	  setGood(good +1)
  }
  
  const handleNeutral = () => {
	  setNeutral(neutral + 1)
  }
  
  const handleBad = () => {
	  setBad(bad + 1)
  }
  
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