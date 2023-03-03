const Display = ({ person }) => <li>{person.name} {person.number}</li>

const Persons = ({ filtered }) => (
	<ul style={{ listStyle: 'none', padding: 0 }}>
		{filtered.map(person => 
			<Display key={person.name} person={person} />
		)}
	</ul>	
)

export default Persons