import { useState, useEffect } from 'react';
import axios from 'axios';

const Display = ({ country }) => (
    <li>
		{country.common}{' '}
		<button>show</button>
	</li>	
)

const ShowView = ({ data }) => (
    <div>
        <h1>{data.name.common}</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Capital {data.capital}</li>
            <li>Area {data.area}</li>
        </ul>
		<h2>Languages</h2>
        <ul>
            {Object.entries(data.languages).map(([key, value]) => (
                <li key={key}>{value}</li>
            ))}
        </ul>
        <img className="country" src={data.flags.png} alt={data.name.common} />
	</div>	
)

const Countries = ({ filtered }) => {
    if (typeof filtered === 'string') {
        return <p>{filtered}</p>
    } else if (filtered.length === 1) {
        return <ShowView data={filtered[0]} />
    } else {
        return (
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filtered.map((country) => (
					<Display key={country.official} country={country} />
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
            axios
				.get('https://restcountries.com/v3.1/all?fields=name')
				.then((response) => {
                const name = response.data.map((obj) => obj.name)
                const filteredInfo = name.filter(({ common }) =>
                    common.toLowerCase().match(query.toLowerCase().trim())
                )
				/* When there are too many countries that match the query,
				then the user is prompted to make their query more specific. */
                if (filteredInfo.length > 10) {
                    setNewCountries('Too many matches, specify another filter')
				/* When there is only one country matching the query, 
				then the basic data of the country (eg. capital and area), 
				its flag and the languages spoken are shown. */
                } else if (filteredInfo.length === 1) {
                    axios
                        .get(`https://restcountries.com/v3.1/name/${filteredInfo[0].common}`)
                        .then((response) => {
                            setNewCountries(response.data)
                            //console.log(response.data)
                        })
				/* If there are ten or fewer countries, but more than one, 
				then all countries matching the query are shown. */
                } else {
                    setNewCountries(filteredInfo)
                }
            })
        } else {
            setNewCountries([])
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