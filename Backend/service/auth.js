// // const sessionIdToUserMap = new Map();   yaha pe ham state ko maintain ker rahe the but abhi hame staate nehi chahiye bcz we use now Stateless Authentication
// const jwt = require("jsonwebtoken");
// const secret = "simple_secret";

// function setUser(user) {                                             // ye particular function hamare liye token banayega user ke liye.
//     // sessionIdToUserMap.set(id, user);
//     return jwt.sign(                                                 // jab bhi mai sign ker raha hun tabhi mai ek secret key use ker raha hun
//         {
//         _id: user._id,
//         email: user.email,
//         }, 
//         secret,
//         //                             { expiresIn: '1h' }  // Token expires in 1 hour
//     );
// }

// function getUser(token) {              // jo bhi user hame frontend se token dega
//     // return sessionIdToUserMap.get(id);
//     if(!token) return null;
//     try {
//         // const decodedUser = jwt.verify(token, secret);   // verify with secret key
//         // return decodedUser;
//         return jwt.verify(token, secret);  // verify with secret key             ,, frontend se jo token aa raha hain kya vo mene generate kya tha is particukar secret key ke through
//     } catch (error) {
//         // console.error("Token validation error:", error.message);  // Log the error for debugging
//         return null;
//     }
    
// }

// module.exports = {
//     setUser,
//     getUser,
// }

// const sessionIdToUserMap = new Map();   yaha pe ham state ko maintain ker rahe the but abhi hame staate nehi chahiye bcz we use now Stateless Authentication


             // jo bhi user hame frontend se token dega
    // return sessionIdToUserMap.get(id);
    // if(!token) return null;
    // try {
    //     // const decodedUser = jwt.verify(token, secret);   // verify with secret key
    //     // return decodedUser;
    //     return jwt.verify(token, secret);  // verify with secret key             ,, frontend se jo token aa raha hain kya vo mene generate kya tha is particukar secret key ke through
    // } catch (error) {
    //     // console.error("Token validation error:", error.message);  // Log the error for debugging
    //     return null;
    // }

    const jwt = require("jsonwebtoken");

    function setUser(user) {                                             // ye particular function hamare liye token banayega user ke liye.
        // sessionIdToUserMap.set(id, user);
        return jwt.sign(                                                 // jab bhi mai sign ker raha hun tabhi mai ek secret key use ker raha hun
            {
            _id: user._id,
            email: user.email,
            }, 
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
            //                             { expiresIn: '1h' }  // Token expires in 1 hour
        );
    }


    function getUser(token) { 
    try {
        // const decoded = /
        return jwt.verify(token, 'simple_secret'); // secret used for verification
        // return decoded;
      } catch (err) {
        return null;
      }
    
}

module.exports = {
    setUser,
    getUser,
}

