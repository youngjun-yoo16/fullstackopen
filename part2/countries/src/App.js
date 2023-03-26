import { useState, useEffect } from 'react';
import Countries from './components/Countries'
import countryService from './services/countries'

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
		countryService
			.getAll(url)
			.then(countryData => {
				getWeather(countryData[0].capital)
				setNewCountries(countryData)
		})
	}
	
	const getWeather = (capitalName) => {
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${capitalName}&appid=${process.env.REACT_APP_API_KEY}`
		countryService
			.getAll(url)
			.then(capitalWeather => {
				setNewWeather(capitalWeather)
		})
	}
	
    useEffect(() => {
        if (query.length > 0) {
			const url = `https://restcountries.com/v3.1/all?fields=name`
			countryService
				.getAll(url)
				.then(countryNames => {
					const name = countryNames.map((obj) => obj.name)
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