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

export default ShowWeather