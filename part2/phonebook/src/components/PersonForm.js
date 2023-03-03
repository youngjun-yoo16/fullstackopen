const PersonForm = ({ addInfoToPhonebook, nameField, setName, onNameChange, numberField, setNumber, onNumberChange, buttonType, buttonText }) => (
	<form onSubmit={addInfoToPhonebook}>
		<div>
			{nameField}: <input value={setName} onChange={onNameChange}/>
		</div>
		<div>
			{numberField}: <input value={setNumber} onChange={onNumberChange}/>	
		</div>
		<div>
		  <button type={buttonType}>
			  {buttonText}
		  </button> 	
		</div>		
	</form>
)

export default PersonForm