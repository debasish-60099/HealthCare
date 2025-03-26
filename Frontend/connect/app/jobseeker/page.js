// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Deciding() {
//   const [selectedService, setSelectedService] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     aadharNumber: "",
//       address: "",
//        pincode: "",
//   });
//   const router = useRouter();

//   const handleServiceClick = (service) => {
//     setSelectedService(service);
//   };
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const allFieldsFilled = Object.values(formData).every((field) => field.trim());
//     if (!allFieldsFilled) {
//         alert("Please fill in all the fields.");
//         return;
//     }
//     // Get the token from cookies
//     const token = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("uid="))
//         ?.split("=")[1];
//     try {
//         const response = await fetch("http://localhost:8005/api/jobseeker/details", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`, // Send token in Authorization header
//             },
//             credentials: "include", // Necessary to send cookies
//             body: JSON.stringify(formData),
//         });
//         console.log("Response:", response);
//         if (response.ok) {
//             router.push("/map"); // Redirect on success
//         } 
//         else {
//             const errorData = await response.json();
//             console.error("Error Response:", errorData);
//             alert(errorData.message || "Failed to save details.");
//         }
//     } catch (error) {
//         console.error("Fetch Error:", error);
//         alert("An error occurred. Please try again.");
//     }
// };
//   // Updated WorkForm component to use handleSubmit and handleChange
//   const WorkForm = () => (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {/* Form fields */}
//       <input
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         required
//         placeholder="Enter your name"
//         // additional styling attributes
//       />
//       <input
//         name="aadharNumber"
//         value={formData.aadharNumber}
//         onChange={handleChange}
//         required
//         placeholder="Enter your Aadhar no."
//         // additional styling attributes
//       />
//        <input
//         name="address"
//         value={formData.address}
//         onChange={handleChange}
//         required
//         placeholder="Enter your address."
//         // additional styling attributes
//       />
//        <input
//         name="pincode"
//         value={formData.pincode}
//         onChange={handleChange}
//         required
//         placeholder="Enter your pincode."
//         // additional styling attributes
//       />
//       {/* Additional fields for each form input... */}
//       <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">
//         Submit
//       </button>
//     </form>
//   );
//   return (
//     <div className="h-screen flex flex-col">
//       <div className="flex flex-grow">
//         <div className="w-1/4 p-4 bg-gray-100">
//           <h2 className="text-xl font-semibold mb-4">Categories</h2>
//           <ul>
//             {["Medical", "Others (inactive)"].map((service) => (
//               <li
//                 key={service}
//                 className={`p-4 mb-4 bg-gray-300 rounded-lg cursor-pointer text-center ${selectedService === service ? 'bg-gray-400' : ''}`}
//                 onClick={() => handleServiceClick(service)}
//               >
//                 {service}
//               </li>
//             ))}
//           </ul>
//         </div>
//         {selectedService && (
//           <div className="w-1/2 p-4 bg-gray-[50]">
//             <h2 className="text-xl font-semibold mb-4">Form</h2>
//             <WorkForm />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





//  "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Deciding() {
//   const [selectedService, setSelectedService] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     aadharNumber: "",
//     address: "",
//     pincode: "",
//   });

//   const router = useRouter();

//   // Handle category selection
//   const handleServiceClick = (service) => {
//     setSelectedService(service);
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Ensure all fields are filled
//     if (Object.values(formData).some((field) => field.trim() === "")) {
//       alert("Please fill in all the fields.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8005/api/jobseeker/details", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // Sends cookies automatically
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         localStorage.setItem("isFormFilled", "true"); // ✅ Update localStorage
//         router.push("/map"); // ✅ Redirect after form submission
//       } else {
//         const errorData = await response.json();
//         alert(errorData.message || "Failed to save details.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col">
//       <div className="flex flex-grow">
//         {/* Sidebar for Categories */}
//         <div className="w-1/4 p-4 bg-gray-100">
//           <h2 className="text-xl font-semibold mb-4">Categories</h2>
//           <ul>
//             {["Medical", "Others (inactive)"].map((service) => (
//               <li
//                 key={service}
//                 className={`p-4 mb-4 rounded-lg cursor-pointer text-center 
//                   ${selectedService === service ? "bg-gray-700 text-white" : "bg-gray-300"}`}
//                 onClick={() => handleServiceClick(service)}
//               >
//                 {service}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Form Section */}
//         {selectedService && (
//           <div className="w-1/2 p-4 bg-gray-50">
//             <h2 className="text-xl font-semibold mb-4">Fill Your Details</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your name"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 name="aadharNumber"
//                 value={formData.aadharNumber}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your Aadhar no."
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your address"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your pincode"
//                 className="w-full p-2 border rounded"
//               />
//               <button
//                 type="submit"
//                 className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
  


"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Deciding() {
  const [selectedService, setSelectedService] = useState("Medical"); // ✅ Default to "Medical"
  const [formData, setFormData] = useState({
    name: "",
    aadharNumber: "",
    address: "",
    preferredPincode: "",
  });

  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((field) => field.trim() === "")) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8005/api/jobseeker/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, service: selectedService }), // ✅ Include selectedService
      });

      if (response.ok) {
        localStorage.setItem("isFormFilled", "true");
        router.push("/map");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to save details.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-grow">
        {/* Sidebar for Categories */}
        <div className="w-1/4 p-4 bg-gray-100">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul>
            {["Medical", "Others (inactive)"].map((service, index) => (
              <li
                key={service}
                className={`p-4 mb-4 rounded-lg cursor-pointer text-center 
                  ${selectedService === service ? "bg-gray-700 text-white" : "bg-gray-300"} 
                  ${index === 1 ? "opacity-50 cursor-not-allowed" : ""}`} // ✅ Disable "Others"
                onClick={() => index === 0 && setSelectedService(service)}
              >
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Form Section */}
        <div className="w-1/2 p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Fill Your Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full p-2 border rounded"
            />
            <input
              type="number" // ✅ Better for Aadhar
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              required
              placeholder="Enter your Aadhar no."
              className="w-full p-2 border rounded"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your address"
              className="w-full p-2 border rounded"
            />
            <input
              type="number" // ✅ Better for Pincode
              name="preferredPincode"
              value={formData.preferredPincode}
              onChange={handleChange}
              required
              placeholder="Enter your pincode"
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

