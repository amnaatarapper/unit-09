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

// Add new course
router.post('/courses', async (req, res, next) => {

	try {

		if (req.body.title) {

			const course = await Course.findOne({
				where: {
					title: req.body.title
				}
			});
		
			if (course) {
				res.status(400).json({"message":"this course already exists"})
			} else {
				try {
					const course = await Course.create(req.body);
					res.status(201).end();
					console.log(course.toJSON());
;				} catch (error) {
					if (error.name === 'SequelizeValidationError') {
						const errors = error.errors.map(err => err.message);
						console.error('Validation errors: ', errors);
						res.status(400).json({errors});
				  
					} else {
						res.status(400).end();
					}
			}
		}
	} else {
		if (req.body.title && req.body.description) {
			res.status(500).end();
		} else {
			res.status(400).end();
		}
	}

} catch (err) {
	res.status(400).end();
}});







module.exports = router;
