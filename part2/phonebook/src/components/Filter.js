const Filter = ({ text, setFilter, onFilterChange }) => (
	<div>
		{text} <input value={setFilter} onChange={onFilterChange}/>
	</div>
)

export default Filter