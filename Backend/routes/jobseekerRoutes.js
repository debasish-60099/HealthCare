const express = require("express");
const { jobSeekerSignUp, jobSeekerLogin, updateJobSeekerDetails,updateLocation} = require("../controllers/jobSeekerController");
// const { updateJobSeekerDetails } = require("../controllers/jobSeekerFormController");
const router = express.Router();

// Existing routes
router.post("/signup", jobSeekerSignUp);
router.post("/login", jobSeekerLogin);

// New route for updating job seeker details
router.post("/details", updateJobSeekerDetails);//form details

router.post("/PreferedLocation",updateLocation );//prefered location

module.exports = router;


// const express = require('express');
// const { updateSeekerDetails } = require('../controllers/jobSeekerController');
// const authenticateToken = require('../middlewares/authMiddleware');

// const router = express.Router();

// // Route to update additional job seeker details
// router.post('/update-details', authenticateToken, updateSeekerDetails);

// module.exports = router;
