import { useState, useEffect } from 'react';
import axios from 'axios';

/* How does showing view for the country work by simply putting one line?
1. I've made getData as a separate function out of useEffect.
2. By clicking the show button, it calls getData function with the name of that country as an argument.
3. getData function gets the data of that country from the REST Countries API.
4. Sets 'countries' state with the data of that country. 
5. The page gets re-rendered and calls Countries component again. 
6. Since the length of an array is 1 [[{...}]], it goes through the second if statement. 
7. Calls ShowView component with the data of that country as an argument. 
8. ShowView component displays the view of the country. */
const Display = ({ country, getData }) => (
    <li>
		{country.common}{' '}
		<button onClick={() => getData(country.common)}>show</button>
	</li>
)

const ShowWeather = ({ weather }) => {
	if (Object.keys(weather).length === 0) return null
	
	const icon = weather.weather[0].icon
	const weatherIconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`
	const temperature = (weather.main.temp - 273.15).toFixed(2)
	
	return (
		<div>
			<h2>Weather in {weather.name}</h2>
			<p>Temperature {temperature} °C</p>
			<img 
				src={weatherIconURL} 
				alt={weather.weather[0].main}
			/>
			<p>Wind {weather.wind.speed} m/s</p>
		</div>
	)
}

const ShowView = ({ data, weather }) => (
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
        <img 
			className="country" 
			src={data.flags.png}
			alt={data.name.common} 
		/>
		<ShowWeather weather={weather} />
	</div>	
)

const Countries = ({ filtered, weather, getData }) => {
    if (typeof filtered === 'string') {
        return <p>{filtered}</p>
    } else if (filtered.length === 1) {
        return <ShowView 
				   data={filtered[0]} 
				   weather={weather} 
			   />
    } else {
        return (
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filtered.map((country) => (
					<Display 
						key={country.official} 
						country={country} 
						getData={getData} 
					/>
                ))}
            </ul>
        )
    }
}

/* Workflow for rendering the page:
1. Typing the country name on the input field causes useEffect to take action. 
2. When there is only one country matching the query, it calls getData(filteredInfo[0].common)
3. getData() function works by getting the information about the country inputted as an argument. 
4. It sets 'countries' state with 'response.data'. 
5. Page gets re-rendered since the value of 'countries' state has changed. 
6. Re-rendered App component returns Countries component as usual.
7. Since one of the parameters of the Countries component, filtered, has a length of 1, it returns ShowView component. 
8. Here, the 'weather' state we passed from the App component to Countries component still has a null value since we haven't yet set any new value to it. 
9. ShowView component returns the ShowWeather component and since 'weather' object has no value in it, ShowWeather component returns null. 
10. This is how first re-rendering gets finished. 
11. getWeather(response.data[0].capital) function finally gets called in the previous call of getData() function. 
12. It gets the information about the capital name inputted as an argument and sets 'weather' state with 'response.data'. 
13. Page gets re-rendered since the value of 'weather' state has changed. 
14. Re-rendered App component once again returns Countries component. 
15. Countries component returns ShowView component and since 'weather' state now contains some value in it, 
    ShowWeather component gets successfully rendered without returning null. */
const App = () => {
    const [query, setNewQuery] = useState('')
    const [countries, setNewCountries] = useState([])
	const [weather, setNewWeather] = useState({})
	
	const getData = (countryName) => {
		const url = `https://restcountries.com/v3.1/name/${countryName}`
		axios
			.get(url)
			.then(response => {
				getWeather(response.data[0].capital)
				setNewCountries(response.data)
		})
	}
	
	const getWeather = (capitalName) => {
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${capitalName}&appid=${process.env.REACT_APP_API_KEY}`
		axios
			.get(url)
			.then(response => {
				setNewWeather(response.data)
		})
	}
	
    useEffect(() => {
        if (query.length > 0) {
            axios
				.get(`https://restcountries.com/v3.1/all?fields=name`)
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
            <Countries 
				filtered={countries} 
				weather={weather} 
				getData={getData} 
			/>
        </div>
    )
}

export default App