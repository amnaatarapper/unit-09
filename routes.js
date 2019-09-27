const express = require('express');

// SEQUELIZE
const db = require('./db');
const {
  Course, User
} = db.models;

// Router instatiation
const router = express.Router();


// Find all courses and their owner
router.get('/', async (req, res, next) => {

	try {

	  	const courses = await Course.findAll({
		include: [{
			model: User,
			attributes: ['id', 'firstName', 'lastName', 'emailAddress']
		}]})
		
		res.status(200).json({ courses });

	  	console.log( courses.map(course => course.toJSON()));

	} catch (err) {
		err.status = 400;
		next(err);
	}
  });

  // Find a specific course and his owner
  router.get('/courses/:id', async (req, res, next) => {

	try {

	  	const course = await Course.findOne({
		where : { id: req.params.id },
		include: [{
			model: User,
			attributes: ['id', 'firstName', 'lastName', 'emailAddress']
		}]})
		
		res.status(200).json({ course });

	  	console.log( course.toJSON() );

	} catch (err) {
		err.status = 400;
		next(err);
	}
  });




module.exports = router;
