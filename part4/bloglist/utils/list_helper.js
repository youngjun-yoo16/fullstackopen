const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	if (blogs.length === 0) return 0
	
	const likes = blogs.map(blog => blog.likes)
	const total = likes.reduce((sum, number) => sum + number, 0)
	
	return total
}

module.exports = {
	dummy,
	totalLikes,
}