const express = require('express');

// SEQUELIZE
const db = require('./db');
const {
  Course, User
} = db.models;

// Router instatiation
const router = express.Router();

router.get('/', (req, res, next) => {
	Course.findAll({
		include: [{
			model: User,
			attributes: ['id', 'firstName', 'lastName', 'emailAddress']
		}]})
		.then(courses => {
			res.status(200);
			res.json({ courses });
		})
		.catch(err => {
			err.status = 400;
			next(err);
		});
});








module.exports = router;
