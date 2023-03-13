/*const Display = ({ person, toggleDelete }) => (
    <li>
        {person.name} {person.number}
	    <button onClick={()=>toggleDelete(person.id)}>delete</button>
    </li>
)*/

const Persons = ({ filtered, toggleDelete }) => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map((person) => (
			<li>
				{person.name} {person.number}
				<button onClick={()=>toggleDelete(person.id)}>delete</button>
			</li>
        ))}
    </ul>
)

export default Persons