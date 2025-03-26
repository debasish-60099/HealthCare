// "use client";  // Marking this file as a Client Component

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";  // Updated import for next/router
// import Link from 'next/link';  // Import Link from next/link

// const JobSeekerLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     // Send POST request to login
//     const response = await fetch("http://localhost:8005/api/jobseeker/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include", // Necessary for cookies
//       body: JSON.stringify({ email, password }),
//     });

    
//     if (response.ok) {
//       const data = await response.json(); // Parse response data
//       localStorage.setItem("isFormFilled", data.isFormFilled);
  
//       if (data.isFormFilled) {
//         router.push("/map");
//       } else {
//         router.push("/jobseeker");
//       }
//     } else {
//       const data = await response.json();
//       alert(data.message || "Login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left Section: Login Form */}
//       <div className="flex-1 flex flex-col justify-center items-center bg-white text-black p-8">
//         <h1 className="text-2xl font-bold mb-4">Login</h1>
//         <p className="mb-4">Welcome back! Please log in to continue.</p>

//         <form onSubmit={handleLogin} className="w-full">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="border border-gray-400 p-2 mb-2 w-full rounded-2xl"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter your password"
//             className="border border-gray-400 p-2 mb-2 w-full rounded-2xl"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <div className="flex mb-4">
//             <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
//               Log In
//             </button>
//           </div>
//         </form>
//         <p className="mb-2">
//           Don't have an account?{" "}
//           <span className="text-blue-500 underline cursor-pointer">
//             <Link href="/JobSeekerSignUp">Sign Up</Link>
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default JobSeekerLogin;


"use client";  // Marking this file as a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation";  
import Link from 'next/link';  

const JobSeekerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Send POST request to login
    const response = await fetch("http://localhost:8005/api/jobseeker/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Necessary for cookies
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse response data

      // ✅ Fix: Use correct key from backend response
      localStorage.setItem("isFormFilled", data.additionalDetailsCompleted); 

      if (data.additionalDetailsCompleted) {
        router.push("/map"); // Redirect to map if details are filled
      } else {
        router.push("/jobseeker"); // Redirect to form page
      }
    } else {
      const data = await response.json();
      alert(data.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white text-black p-8">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="mb-4">Welcome back! Please log in to continue.</p>

        <form onSubmit={handleLogin} className="w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-400 p-2 mb-2 w-full rounded-2xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-400 p-2 mb-2 w-full rounded-2xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex mb-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              Log In
            </button>
          </div>
        </form>
        <p className="mb-2">
          Don't have an account?{" "}
          <span className="text-blue-500 underline cursor-pointer">
            <Link href="/JobSeekerSignUp">Sign Up</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default JobSeekerLogin;
