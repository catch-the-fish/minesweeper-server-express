import mongoose from 'mongoose';

mongoose.connect(process.env.DB_STRING || 'mongodb://localhost/minesweeper', {
  useCreateIndex: true, // deprecation warning with Schema.index()
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const database = mongoose.connection.getClient();
database.on('error', console.error.bind(console, 'connection error:'));

export default database;
