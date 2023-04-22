const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	if (blogs.length === 0) return 0
	
	const likes = blogs.map(blog => blog.likes)
	const total = likes.reduce((sum, number) => sum + number, 0)
	
	return total
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) return undefined
	else if (blogs.length === 1) {
		return {title: blogs[0].title, author: blogs[0].author, likes: blogs[0].likes}
	} else {
		const favorite = blogs.reduce((prev, current) => prev.likes > current.likes ? prev : current, 0)
		return {title: favorite.title, author: favorite.author, likes: favorite.likes}
	}
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
}