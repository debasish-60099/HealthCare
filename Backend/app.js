
// const express = require("express");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const jobseekerRoutes = require("./routes/jobseekerRoutes");
// const recruiterRoutes = require("./routes/recruiterRoutes");
// const Nurse = require("./models/Seeker.js");
// // new
// const http = require("http");
// const { Server } = require("socket.io");
// require("dotenv").config();
// const jwt= require("./controllers/jobSeekerController.js");

// const app = express();
// const PORT = 8005;

// // MongoDB connection
// mongoose.connect("mongodb://localhost:27017/recruiter", {
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,
// })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("MongoDB connection failed:", err));

// // CORS configuration
// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your frontend URL
//   credentials: true, // Allow cookies to be sent across origins
// }));

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// // Nurse WebSocket Connection
// io.on("connection", (socket) => {
//   const token = socket.handshake.auth.token;
//   console.log("A user connected:", socket.id);

//   // Nurse updates live location
//   socket.on("updateLocation", async (data) => {
//     const { nurseId, latitude, longitude } = data;
    
//     try {
//       const nurse = await Nurse.findByIdAndUpdate({_id: nurseId}, {
//         location: { latitude, longitude },
//         isActive: true
//       }, { new: true });

//       // Broadcast updated location to all patients
//       io.emit("nurseLocationUpdate", nurse);
//     } catch (error) {
//       console.error("Error updating location:", error);
//     }
//   });

//   // Nurse goes offline
//   socket.on("goOffline", async (nurseId) => {
//     await Nurse.findByIdAndUpdate(nurseId, { isActive: false });
//     io.emit("nurseOffline", { nurseId });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });


// // API to store nurse preferred pincode
// app.post("/set-preferred-location", async (req, res) => {
//   const { nurseId, preferredPincode } = req.body;
  
//   try {
//     const nurse = await Nurse.findByIdAndUpdate(nurseId, { preferredPincode }, { new: true });
//     res.status(200).json(nurse);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update preferred location" });
//   }
// });


// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use("/api/jobseeker", jobseekerRoutes);
// app.use("/api/recruiter", recruiterRoutes);

// // Start server
// // app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// server.listen(PORT, () => console.log(`Server with Socket.io started on port ${PORT}`)); // insteed of line 125 i added new thing in 127




 require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jobseekerRoutes = require("./routes/jobseekerRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const Nurse = require("./models/Seeker.js");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const PORT = 8005;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/recruiter")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/jobseeker", jobseekerRoutes);
app.use("/api/recruiter", recruiterRoutes);

// ✅ Start server


// HTTP + Socket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// ✅ SOCKET.IO AUTH MIDDLEWARE
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log("❌ No token provided");
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded._id; // attach to socket
    next();
  } catch (err) {
    console.log("❌ Invalid token:", err.message);
    return next(new Error("Invalid token"));
  }
});

// ✅ SOCKET.IO CONNECTION
io.on("connection", (socket) => {
  const nurseId = socket.userId;
  console.log("✅ Nurse connected:", nurseId);

  // ⏱ Update Location
  socket.on("updateLocation", async (data) => {
    const { latitude, longitude } = data;
    try {
      const updatedNurse = await Nurse.findByIdAndUpdate(
        nurseId,
        {
          location: { latitude, longitude },
          isActive: true,
        },
        { new: true }
      );
      io.emit("nurseLocationUpdate", updatedNurse);
    } catch (err) {
      console.error("❌ Error updating location:", err);
    }
  });

  // 📴 Go Offline
  socket.on("goOffline", async () => {
    try {
      await Nurse.findByIdAndUpdate(nurseId, { isActive: false });
      io.emit("nurseOffline", { nurseId });
    } catch (err) {
      console.error("❌ Error updating status to offline:", err);
    }
  });

  // 🔌 On Disconnect
  socket.on("disconnect", async () => {
    console.log("⚠️ Nurse disconnected:", nurseId);
    try {
      await Nurse.findByIdAndUpdate(nurseId, { isActive: false });
      io.emit("nurseOffline", { nurseId });
    } catch (err) {
      console.error("❌ Error marking nurse offline on disconnect:", err);
    }
  });
});

// ✅ Preferred Location Route
app.post("/set-preferred-location", async (req, res) => {
  const { nurseId, preferredPincode } = req.body;
  try {
    const updatedNurse = await Nurse.findByIdAndUpdate(
      nurseId,
      { preferredPincode },
      { new: true }
    );
    res.status(200).json(updatedNurse);
  } catch (err) {
    res.status(500).json({ error: "Failed to update preferred location" });
  }
});


app.listen(PORT, () =>
  console.log(`🚀 Server with Socket.io started on port ${PORT}`)
);

// ✅ Routes

