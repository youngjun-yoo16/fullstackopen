const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
	type: String,
	required: true,
	minLength: 3,
	unique: true
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator)

/* Only applies when 'toJSON' function is explicitly called. 
If an object has a toJSON function, JSON.stringify() calls toJSON() and serializes the return value from toJSON() instead.
Express' response.json() function convert objects to JSON using JSON.stringify(). 
So custom toJSON() functions work with those modules as well. */
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User