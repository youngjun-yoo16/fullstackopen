import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
	const [query, setNewQuery] = useState('')
	
	useEffect(() => {
		if (query.length > 0) {
			console.log(`Search query is now ${query}`)
			axios
			  .get(`https://restcountries.com/v3.1/all?fields=name`)
			  .then(response => {
				const name = (response.data.map(obj => obj.name))
				const filteredInfo = (name.filter(({ common }) => common.toLowerCase().match(query.toLowerCase().trim())))
				console.log(filteredInfo)
				if (filteredInfo.length > 10) console.log('Too many matches, specify another filter')
			})
		}
	}, [query])
	
	const hanleQueryChange = (event) => setNewQuery(event.target.value)
	
	return (
		<div>
			find countries <input value={query} onChange={hanleQueryChange} />
		</div>
	)
}

export default App
