import "./style.css";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { doGraphQLFetch } from "./graphql/fetch";
import {
  //createUser,
  // login,
  checkToken,
  // createUser,
  //updateUser,
  //deleteUser,
  //userById,
  //allUsers,
  // addNotification,
  // deleteNotification,
  // notificationsByUser,
  //allNotifications,
  // addFavourite,
  // deleteLocation,
  // //allLocations,
  // locationsByUser,
} from "./graphql/queries";
// import LoginMessageResponse from "./interfaces/LoginMessageResponse";
import { User } from "./interfaces/User";
// import { io, Socket } from "socket.io-client";
// import {
//   ClientToServerEvents,
//   ServerToClientEvents,
// } from "./interfaces/ISocket";
// import { Credentials } from "./interfaces/Credentials";

// Global variables
const apiURL = import.meta.env.VITE_API_URL;
// const socketURL = import.meta.env.VITE_SOCKET_URL;

const user: User = {};

// const loginButton = document.querySelector(
//   "#loginButton"
// ) as HTMLButtonElement;

// const logoutButton = document.querySelector(
//   "#navContentPageLogout"
// ) as HTMLElement;

// const registerButton = document.querySelector(
//   "#navContent2"
// ) as HTMLElement;


// check token
(async () => {
  const token = localStorage.getItem("token");

  if (token !== null) {
    try {
      const isTokenValid = await doGraphQLFetch(apiURL, checkToken, {}, token);
      if (isTokenValid.checkToken?.message === "Token is valid") {
        console.log("token valid");
        user.username = isTokenValid.checkToken.user.user_name;
      }
    } catch (error) {
      console.log(error);
    }
  }
})();

// logout handling
// logoutButton.addEventListener("click", () => {
//   localStorage.removeItem("token");
//   user.username = "";
// });

// registering a new account
// registerButton.addEventListener("click", () => {
//   console.log("testitesti")
// })

// console.log("TES>TI")
// const registerForm = document.querySelector("#userContent") as HTMLFormElement;
// registerForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const username = registerForm.querySelector("#username") as HTMLInputElement;
//   const password = registerForm.querySelector("#password") as HTMLInputElement;

//   const credentials = {
//     username: username.value,
//     password: password.value,
//   };

//   try {
//     const registerData = (await doGraphQLFetch(apiURL, createUser, {
//       credentials,
//     })) as LoginMessageResponse;
//     console.log(registerData);
//     localStorage.setItem("token", registerData.token!);
//     user.username = registerData.user.username!;
//     window.location.href = 'dogPark.html';
//   } catch (error) {
//     console.log(error);
//   }
// });
// });
