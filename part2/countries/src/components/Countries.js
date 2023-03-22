import ShowView from './ShowView'

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

export default Countries