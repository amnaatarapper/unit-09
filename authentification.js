const bycryptjs = require('bcryptjs');
const auth = require('basic-auth');
// SEQUELIZE
const db = require('./db');
const {
	Course,
	User
} = db.models;

const authentification = async (req, res, next) => {
  let message; 
    // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  
// If the user's credentials are available...
  if(credentials) {

    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });
    
  // If a user was successfully retrieved from the data store...
    // Use the bcryptjs npm package to compare the user's password
    // (from the Authorization header) to the user's password
    // that was retrieved from the data store.
    if (user) {
      const authentificated = bycryptjs.compareSync(credentials.pass, user.password);

      if (authentificated) {
        // If the passwords match...
          // Then store the retrieved user object on the request object
          // so any middleware functions that follow this middleware function
          // will have access to the user's information.
          req.currentUser = user;
          console.log(`Authentication successful for username: ${user.emailAddress}`);
      }  else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.emailAddress}`;
    }
  } else {
    message = 'Auth header not found';
  }
// If user authentication failed...
  // Return a response with a 401 Unauthorized HTTP status code.
// Or if user authentication succeeded...
  // Call the next() method.
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
}; 


module.exports = authentification;