import { useState, useEffect } from 'react';
import axios from 'axios';

const Countries = ({ filtered }) => {
    if (typeof filtered === 'string') {
        return <p>{filtered}</p>;
    } else if (filtered.length === 1) {
        const data = filtered[0];
        return (
            <div>
                <h1>{data.name.common}</h1>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>capital {data.capital}</li>
                    <li>area {data.area}</li>
                </ul>
                <p>
                    <b>languages:</b>
                </p>
                <ul>
                    {Object.entries(data.languages).map(([key, value]) => (
                        <li key={key}>{value}</li>
                    ))}
                </ul>
                <img className="country" src={data.flags.png} alt={data.name.common} />
            </div>
        );
    } else {
        return (
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filtered.map((country) => (
                    <li key={country.official}>{country.common}</li>
                ))}
            </ul>
        );
    }
};

const App = () => {
    const [query, setNewQuery] = useState('');
    const [countries, setNewCountries] = useState([]);

    useEffect(() => {
        if (query.length > 0) {
            axios
				.get('https://restcountries.com/v3.1/all?fields=name')
				.then((response) => {
                const name = response.data.map((obj) => obj.name);
                const filteredInfo = name.filter(({ common }) =>
                    common.toLowerCase().match(query.toLowerCase().trim())
                );
				/* When there are too many countries that match the query,
				then the user is prompted to make their query more specific. */
                if (filteredInfo.length > 10) {
                    setNewCountries('Too many matches, specify another filter');
				/* When there is only one country matching the query, 
				then the basic data of the country (eg. capital and area), 
				its flag and the languages spoken are shown. */
                } else if (filteredInfo.length === 1) {
                    axios
                        .get(`https://restcountries.com/v3.1/name/${filteredInfo[0].common}`)
                        .then((response) => {
                            setNewCountries(response.data);
                            //console.log(response.data)
                        });
				/* If there are ten or fewer countries, but more than one, 
				then all countries matching the query are shown. */
                } else {
                    setNewCountries(filteredInfo);
                }
            });
        } else {
            setNewCountries([]);
        }
    }, [query]);

    const hanleQueryChange = (event) => setNewQuery(event.target.value);

    return (
        <div>
            find countries <input value={query} onChange={hanleQueryChange} />
            <Countries filtered={countries} />
        </div>
    );
};

export default App;