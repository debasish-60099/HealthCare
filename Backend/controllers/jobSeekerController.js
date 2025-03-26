const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JobSeeker = require("../models/Seeker");
const { setUser } = require("../service/auth");
const {getUser} = require("../service/auth");

// JobSeeker Signup Controller
const jobSeekerSignUp = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await JobSeeker.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Redirecting to login." });
        }
 
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new job seeker in the database with hashed password
        const newJobSeeker = new JobSeeker({ email, password: hashedPassword });
        await newJobSeeker.save();

        // Create JWT token and send response
        const token = setUser(newJobSeeker);
        res.cookie("uid", token, { httpOnly: true });
        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const jobSeekerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Find the user by email
      const jobSeeker = await JobSeeker.findOne({ email });
      if (!jobSeeker) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Compare hashed password
      const isPasswordMatch = await bcrypt.compare(password, jobSeeker.password);
      if (!isPasswordMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Ensure `additionalDetailsCompleted` exists
      if (typeof jobSeeker.additionalDetailsCompleted === "undefined") {
          jobSeeker.additionalDetailsCompleted = false;
          await jobSeeker.save(); // ✅ Save the update if it's missing
      }

      // Generate JWT token
      const token = setUser(jobSeeker);
      res.cookie("uid", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // ✅ Secure cookie in production
          sameSite: "lax",
      });

      // Return response with login details
      res.status(200).json({
          message: "Login successful",
          additionalDetailsCompleted: jobSeeker.additionalDetailsCompleted, // ✅ Correctly return field
          user: {
              email: jobSeeker.email,
              name: jobSeeker.details?.name || "",
              aadharNumber: jobSeeker.details?.aadhaar || "",
              address: jobSeeker.details?.address || "",
             preferredPincode: jobSeeker.details?.preferredPincode || "",
          },
      });

  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { jobSeekerLogin };




  
async function updateJobSeekerDetails(req, res) {
  try {
    // Check if token exists in cookies
    const token = req.cookies.uid;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Decode JWT token to extract user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Use environment variable
    } catch (err) {
      return res.status(403).json({ error: "Unauthorized: Invalid token" });
    }

    const userId = decoded._id;
    const { name, aadharNumber, address, preferredPincode } = req.body;

    // Validate input fields
    if (!name || !aadharNumber || !address || !preferredPincode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Update job seeker details
    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
      userId,
      {
        $set: {
          "details.name": name,
          "details.aadhaar": aadharNumber,
          "details.address": address,
          "details.preferredPincode": preferredPincode,
          additionalDetailsCompleted: true, // Mark form as completed
        },
      },
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!updatedJobSeeker) {
      return res.status(404).json({ error: "Job seeker not found" });
    }

    res.status(200).json({
      message: "Details updated successfully",
      additionalDetailsCompleted: true,
    });
  } catch (error) {
    console.error("Error updating job seeker:", error);
    res.status(500).json({ error: "Failed to update job seeker details" });
  }
}

module.exports = { updateJobSeekerDetails };





const updateLocation = async (req, res) => {
  const { latitude, longitude, isActive } = req.body;

  if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {
      const jobSeeker = await JobSeeker.findByIdAndUpdate(
          req.userId, // Assuming userId is decoded and available from the token
          {
              $set: { 
                  location: { latitude, longitude },
                  isActive
              }
          },
          { new: true }
      );
      res.status(200).json({ message: "Location updated successfully", jobSeeker });
  } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ error: "Failed to update location" });
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.cookies.uid;
  if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded._id; // Attach userId to request
      next();
  } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
  }
};


module.exports = {
  jobSeekerSignUp,
  jobSeekerLogin,
  updateJobSeekerDetails,
  updateLocation,
  authMiddleware,
};




