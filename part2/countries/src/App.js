import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ filtered }) => {
	if (typeof(filtered) === 'string') {
		return <p>{filtered}</p>
	} else {
		return (
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{filtered.map((country) => (
					<li key={country.official}>
						{country.common}
					</li>
				))}
			</ul>
		)
	}
}

const App = () => {
	const [query, setNewQuery] = useState('')
	const [countries, setNewCountries] = useState([])
	
	useEffect(() => {
		if (query.length > 0) {
			console.log(`Search query is now ${query}`)
			axios
			  .get('https://restcountries.com/v3.1/all?fields=name')
			  .then(response => {
				const name = (response.data.map(obj => obj.name))
				const filteredInfo = (name.filter(({ common }) => common.toLowerCase().match(query.toLowerCase().trim())))
				if (filteredInfo.length > 10) {
					setNewCountries('Too many matches, specify another filter')
				} else {
					setNewCountries(filteredInfo)	
				} 
			})
		}
	}, [query])
	
	const hanleQueryChange = (event) => setNewQuery(event.target.value)
	
	return (
		<div>
			find countries <input value={query} onChange={hanleQueryChange} />
			<Countries filtered={countries} />
		</div>
	)
}

export default App
