module.exports = require('mongoose')
	.connect(process.env.DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
		useCreateIndex: true,
	})
	.then(() => console.log('Database connection successful'))
	.catch((err) => console.log('Database connection error')); 
