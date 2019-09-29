const express = require('express');
const bycryptjs = require('bcryptjs');
const authentification = require('./authentification');

// SEQUELIZE
const db = require('./db');
const {
	Course,
	User
} = db.models;

// Router instatiation
const router = express.Router();


//****** COURSES ROUTES *********/

// Find all courses and their owners
router.get('/courses', async (req, res, next) => {

	try {

		const courses = await Course.findAll({
			include: [{
				model: User,
				attributes: ['id', 'firstName', 'lastName', 'emailAddress']
			}]
		})

		res.status(200).json({
			courses
		});

		console.log(courses.map(course => course.toJSON()));

	} catch (error) {
		res.status(500).end();
		next(error);
	}
});

// Find a specific course and his owner
router.get('/courses/:id', async (req, res, next) => {

	try {

		const course = await Course.findOne({
			where: {
				id: req.params.id
			},
			include: [{
				model: User,
				attributes: ['id', 'firstName', 'lastName', 'emailAddress']
			}]
		})

		if (course) {
			res.status(200).json({ course });
			console.log(course.toJSON());
		} else {
			res.status(404).end();
		}

	} catch (error) {
		res.status(500).end();
		next(error);
	}
});

// Add new course
router.post('/courses', authentification, async (req, res, next) => {

	try {

		if (req.body.title) {

			const course = await Course.findOne({
				where: {
					title: req.body.title
				}
			});

			if (course) {
				res.status(400).json({
					"message": "this course already exists"
				})
			} else {
				try {
					let course = req.body;
					course.userId = req.currentUser.id;
					await Course.create(course);
					res.status(201).end();
					console.log(course.toJSON());
				} catch (error) {
					if (error.name === 'SequelizeValidationError') {
						const errors = error.errors.map(error => error.message);
						console.error('Validation errors: ', errors);
						res.status(400).json({
							errors
						});

					} else {
						res.status(400).end();
					}
				}
			}
		} else {
			if (req.body.title && req.body.description && req.body.UserId) {
				res.status(500).end();
			} else {
				res.status(400).end();
			}
		}

	} catch (error) {
		
	}
});

// Update course
router.put('/courses/:id', authentification, async (req, res, next) => {

	try {

		const course = await Course.findByPk(req.params.id);

		if (course && course.userId === req.currentUser.id) {

			if (req.body.title || req.body.description) {
				try {
					await course.update(req.body);
					res.status(201).end();
				} catch (error) {
					res.status(500).end();
					next(error);
				}
			} else {
				res.status(400).end();
			}
		} else {
			res.status(404).end();
		}


	} catch (error) {
		res.status(500).end();
		next(error);
	}
	
});


//****** USERS ROUTES *********/

// Get the currently logged user
router.get('/users', authentification, (req, res, next) => {
	const user = req.currentUser;
	res.json({ user });
});

// Add a new user
router.post('/users', async (req, res, next) => {
	try {

		let user = req.body;
		user.password = bycryptjs.hashSync(req.body.password);
		await User.create(user);
		res.status(201).end();

	} catch (error) {
		if (error.name === 'SequelizeValidationError') {
			const errors = error.errors.map(error => error.message);
			console.error('Validation errors: ', errors);
			res.status(400).json({ errors });
		} else if (error.name === 'SequelizeUniqueConstraintError') {
			const errors = error.errors.map(error => error.message);
			console.error('Validation errors: ', errors);
			res.status(400).json({ "message":"This user already exists" });
		} else {
			res.status(400).end();
			next(error);
		}
}});


module.exports = router;