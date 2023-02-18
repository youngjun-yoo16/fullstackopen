import { useState } from 'react'

const Button = (props) => (
	<button onClick={props.setFeedback}>
		{props.text}
	</button>
)

const Statistics = (props) => {
	return (
		<div>
			<p>good {props.good}</p>
			<p>neutral {props.neutral}</p>
			<p>bad {props.bad}</p>
			<p>all {props.all}</p>
			<p>average {props.average}</p>
			<p>positive {props.positive} %</p>
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
	  return (good / all) * 100
  } 
  
  return (
    <div>
      <h1>give feedback</h1>
	  <Button setFeedback={handleGood} text="good" />
	  <Button setFeedback={handleNeutral} text="neutral" />
	  <Button setFeedback={handleBad} text="bad" />	
	  <h1>statistics</h1>
	  <Statistics good={good} neutral={neutral} bad={bad} all={all}
		 average={average()} positive={positive()} />
    </div>
  )
}

export default App