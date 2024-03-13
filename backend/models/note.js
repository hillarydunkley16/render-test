const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();


// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.mongoUrl 
console.log("connecting to: " + url)

mongoose.set('strictQuery',false)
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.mongoUser,
  pass: process.env.mongoPwrd,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));


const noteSchema = new mongoose.Schema({

  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)