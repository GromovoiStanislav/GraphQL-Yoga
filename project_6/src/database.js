import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log('MongoDB is Connected'))
  .catch(err => console.log(err));