// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000/admin", {
//   transports: ["websocket", "polling"],
//   reconnection: true,
//   reconnectionAttempts: 5,
// });

// export default socket;


// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://192.168.1.23:3000/admin", {
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  auth: (cb) => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token being sent to socket:", token); // <-- check this
    cb({ token });
  },
});

export default socket;




