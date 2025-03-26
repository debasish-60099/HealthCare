

const mongoose = require('mongoose');

const JobSeekerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    details: {
      name: {
        type: String,
        required: false, // Captured on the second page
      },
      aadhaar: {
        type: String,
        required: false, // Captured on the second page
      },
      address: {
        type: String,
        required: false,
      },
      preferredPincode: {
        type: String,
        required: false,
      },
    },
    
    additionalDetailsCompleted: { type: Boolean, default: false },

    location: {
      latitude: {
        type: Number,
        required: false, // Make sure it's not required if you want to set it later
      },
      longitude: {
        type: Number,
        required: false, // Make sure it's not required if you want to set it later
      },
    },
    isActive: {type: Boolean, default: false},
  },



  { timestamps: true } // Adds createdAt and updatedAt fields
);

const JobSeeker = mongoose.model('JobSeeker', JobSeekerSchema);

module.exports = JobSeeker;
