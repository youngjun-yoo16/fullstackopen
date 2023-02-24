const Header = ({ name }) => {
	return (
		<div>
			<h2>{name}</h2>
		</div>
	)
}

const Part = ({ part }) => {
	return (
		<div>
			<p>
				{part.name} {part.exercises}
			</p>
		</div>
	)
}

const Content = ({ parts }) => {
	return (
		<div>
			{parts.map(part =>
				<Part key={part.id} part={part} />
			)}
		</div>
	)
}

const Total = ({ parts }) => {
	return (
		<div>
			<p>
			   <b>
				   total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
			   </b>
			</p>
		</div>
	)
}

const Course = ({ courses }) => {
	return (
		<div>
			{courses.map(course =>
				<div key={course.id}>
					<Header name={course.name} />
					<Content parts={course.parts} />
					<Total parts={course.parts} />
				</div>
			)}
		</div>
	)
}

export default Course