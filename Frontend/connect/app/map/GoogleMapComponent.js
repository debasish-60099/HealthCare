// "use client";
// import React, { useEffect, useState } from 'react';
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// // Custom map style to remove unwanted markers
// const mapStyle = [
//   {
//     featureType: "poi", // Hide Points of Interest (restaurants, etc.)
//     stylers: [{ visibility: "off" }],
//   },
//   {
//     featureType: "transit", // Hide transit stations
//     stylers: [{ visibility: "off" }],
//   },
//   {
//     featureType: "administrative", // Hide administrative labels
//     elementType: "labels",
//     stylers: [{ visibility: "off" }],
//   },
//   {
//     featureType: "road", // Hide road labels
//     elementType: "labels",
//     stylers: [{ visibility: "off" }],
//   },
// ];

// export default function GoogleMapComponent() {
//   const [center, setCenter] = useState({ lat: 28.549507, lng: 77.203613 }); // Initial coordinates
//   const [nurseLocations, setNurseLocations] = useState([]); // State to store nurse locations

//   // Fetch coordinates for the customer
//   useEffect(() => {
//     const fetchCustomerCoordinates = async () => {
//       try {
//         const response = await fetch('/api/getCustomerCoordinates'); // Replace with your actual API endpoint
//         const data = await response.json();
//         setCenter({ lat: data.lat, lng: data.lng });
//       } catch (error) {
//         console.error("Error fetching customer coordinates:", error);
//       }
//     };

//     // Fetch nurse locations based on pincode
//     const fetchNurseLocations = async () => {
//       try {
//         const response = await fetch('/api/getNurseLocations'); // Replace with your actual API endpoint
//         const data = await response.json();
//         setNurseLocations(data); // Assuming data is an array of { lat, lng }
//       } catch (error) {
//         console.error("Error fetching nurse locations:", error);
//       }
//     };

//     fetchCustomerCoordinates();
//     fetchNurseLocations();
//   }, []);

//   const mapContainerStyle = {
//     height: "500px",
//     width: "100%",
//   };

//   return (
//     <LoadScript googleMapsApiKey="AIzaSyBdgpPCT941Wbg9NmltKgaDAmerPxUdM4Y">
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={center}
//         zoom={12}
//         options={{ styles: mapStyle }}
//       >
//         {/* Marker for the customer */}
//         <Marker position={center} />

//         {/* Render multiple markers for nurses */}
//         {nurseLocations.map((location, index) => (
//           <Marker key={index} position={{ lat: location.lat, lng: location.lng }} />
//         ))}
//       </GoogleMap>
//     </LoadScript>
//   );
// }







"use client";
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { io } from "socket.io-client";

const mapStyle = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
];

let socket;

export default function GoogleMapComponent() {
  const [center, setCenter] = useState({ lat: 28.549507, lng: 77.203613 });
  const [nurseLocations, setNurseLocations] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isActive, setIsActive] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("token");
      try {
        const parsed = JSON.parse(token);
        if (parsed?.token) token = parsed.token;
      } catch (e) { }

      socket = io("http://localhost:8005", {
        auth: { token }
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected");
        setIsSocketConnected(true);
      });

      socket.on("connect_error", (err) => {
        console.error("❌ Socket error:", err.message);
      });

      return () => {
        if (socket) socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const fetchNurseLocations = async () => {
      try {
        const res = await fetch("http://localhost:8005/api/jobseeker/PreferedLocation");
        const data = await res.json();
        setNurseLocations(data);
      } catch (err) {
        console.error("Error fetching nurses:", err);
      }
    };

    fetchNurseLocations();
    const interval = setInterval(fetchNurseLocations, 8005); // Poll every 5 sec
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isActive && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          if (socket) {
            socket.emit("updateLocation", { latitude, longitude });
          }
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isActive]);

  const toggleActiveStatus = () => {
    setIsActive((prev) => {
      const newStatus = !prev;
      if (socket) {
        socket.emit(newStatus ? "goOnline" : "goOffline");
      }
      return newStatus;
    });
  };

  return (
    <div className="p-4">
      <LoadScript googleMapsApiKey="AIzaSyBdgpPCT941Wbg9NmltKgaDAmerPxUdM4Y">
        <GoogleMap
          mapContainerStyle={{ height: "500px", width: "100%" }}
          center={center}
          zoom={12}
          options={{ styles: mapStyle }}
        >
          <Marker position={center} />
          {nurseLocations.map((loc, idx) => (
            <Marker key={idx} position={{ lat: loc.lat, lng: loc.lng }} />
          ))}
          {location.latitude && <Marker position={{ lat: location.latitude, lng: location.longitude }} />}
        </GoogleMap>
      </LoadScript>
      <div className="mt-4">
        <button onClick={toggleActiveStatus} className={`px-4 py-2 text-white rounded ${isActive ? "bg-red-500" : "bg-green-500"}`}>
          {isActive ? "Go Offline" : "Go Online"}
        </button>
        <p className="mt-2 text-sm">
          Socket Status: {isSocketConnected ? <span className="text-green-600">Connected</span> : <span className="text-yellow-600">Connecting...</span>}
        </p>
      </div>
    </div>
  );
}
