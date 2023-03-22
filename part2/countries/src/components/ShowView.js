import ShowWeather from './ShowWeather'

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

export default ShowView