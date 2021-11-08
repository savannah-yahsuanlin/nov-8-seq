const { Sequelize, DataTypes } = require('sequelize');
const pg = require('pg')
const faker = require('faker')
const db = new Sequelize('postgres://localhost/seq')

const User = db.define('User', {
	email:{ 
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isEmail:true
		}
	},
	bio: {
		type: DataTypes.TEXT,
	}
})

User.beforeSave(user => {
	if(!user.bio) {
		user.bio = `${user.email} BIO is ${faker.lorem.paragraphs(3)}`
	}
})

const syncAndSeed = async() => {
	await  db.sync({ force: true });
	await User.create({email: 'pe@gmail.com', bio: 'yes!! it is easier.'})
	await User.create({email: 'john@gmail.com'})
}


const init =  async() => {
	try  {
		await db.authenticate();
		await syncAndSeed();
		console.log(await User.findAll())
  		//console.log('Connection has been established successfully.');
	}
	catch(error){
		console.error('Unable to connect to the database:', error);
	}

}

init();