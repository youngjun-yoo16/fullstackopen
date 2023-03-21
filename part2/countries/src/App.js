import { useState, useEffect } from 'react';
import axios from 'axios';

/* How does showing view for the country work by simply putting one line?
1. I've made getData as a separate function out of useEffect.
2. By clicking the show button, it calls getData function with the name of that country as an argument.
3. getData function gets the data of that country from the REST Countries API.
4. Sets 'countries' state with the data of that country. 
5. The page gets re-rendered and calls Countries component again. 
6. Since the length of an array is 1, it goes through the second if statement. 
7. Calls ShowView component with the data of that country as an argument. 
8. ShowView component displays the view of the country. */
const Display = ({ country, getData }) => (
    <li>
		{country.common}{' '}
		<button onClick={() => getData(country.common)}>show</button>
	</li>
)

const ShowWeather = ({ weather }) => {
	console.log(weather)
	if (Object.keys(weather).length === 0) return null
	return <p>Temperature {(weather.main.temp - 273.15).toFixed(2)} Celsius</p>
}

const ShowView = ({ data, weather }) => {
	console.log(weather)
	console.log(data)
    return ( <div>
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
		<h2>Weather in {data.capital}</h2>
		<ShowWeather weather={weather} />
	</div>	
)}

const Countries = ({ filtered, weather, getData }) => {
    if (typeof filtered === 'string') {
        return <p>{filtered}</p>
    } else if (filtered.length === 1) {
        return <ShowView data={filtered[0]} weather={weather} />
    } else {
        return (
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filtered.map((country) => (
					<Display key={country.official} country={country} getData={getData} />
                ))}
            </ul>
        )
    }
}

const App = () => {
    const [query, setNewQuery] = useState('')
    const [countries, setNewCountries] = useState([])
	const [weather, setNewWeather] = useState({})
	
	const getData = (countryName) => {
		axios
			.get(`https://restcountries.com/v3.1/name/${countryName}`)
			.then(response => {
				getWeather(response.data[0].capital)
				setNewCountries(response.data)
		})
	}
	
	const getWeather = (capitalName) => {
		axios
			.get(`https://api.openweathermap.org/data/2.5/weather?q=${capitalName}&appid=${process.env.REACT_APP_API_KEY}`)
			.then(response => {
				console.log(response.data)
				console.log(response.data.main.temp)
				setNewWeather(response.data)
		})
	}
	
    useEffect(() => {
        if (query.length > 0) {
            axios
				.get('https://restcountries.com/v3.1/all?fields=name')
				.then(response => {
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
					getData(filteredInfo[0].common)
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
            <Countries filtered={countries} weather={weather} getData={getData} />
        </div>
    )
}

export default App