import { useState } from 'react'

const Display = ({ value }) => <div>{value}</div> 

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Test2 = () => {
  const [value, setValue] = useState(10)
  
  const setToValue = (newValue) => {
	console.log('value now', newValue)
    setValue(newValue)
  }
  
  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}

export default Test2