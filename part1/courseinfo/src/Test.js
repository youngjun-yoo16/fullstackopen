import { useState } from 'react'

const Test = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter)

  return (
    <div>
		  <h1>{ counter }</h1>
	</div>
  )
}

export default Test