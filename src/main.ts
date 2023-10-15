import "./style.css";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { doGraphQLFetch } from "./graphql/fetch";
import {
  //createUser,
  login,
  checkToken,
  //updateUser,
  //deleteUser,
  //userById,
  //allUsers,
  //addNotification,
  //deleteNotification,
  //notificationsByUser,
  //allNotifications,
  //addFavourite,
  //deleteLocation,
  //allLocations,
  //locationsByUser
} from "./graphql/queries";
import LoginMessageResponse from "./interfaces/LoginMessageResponse";
import { User } from "./interfaces/User";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./interfaces/ISocket";

// Global variables
const apiURL = import.meta.env.VITE_API_URL;
const socketURL = import.meta.env.VITE_SOCKET_URL;

const user: User = {};

const loginButton = document.querySelector(
  "#loginButton"
) as HTMLButtonElement;

const logoutButton = document.querySelector(
  "#navContentPageLogout"
) as HTMLElement;

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

// login handling
loginButton.addEventListener("click", async () => {
  console.log('ree');
  const loginForm = document.querySelector("#userContent") as HTMLFormElement;
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = loginForm.querySelector("#username") as HTMLInputElement;
    const password = loginForm.querySelector("#password") as HTMLInputElement;

    const credentials = {
      username: username.value,
      password: password.value,
    };

    try {
      const loginData = (await doGraphQLFetch(apiURL, login, {
        credentials,
      })) as LoginMessageResponse;
      console.log(loginData);
      localStorage.setItem("token", loginData.token!);
      user.username = loginData.user.username!;
      window.location.href = 'dogPark.html';
    } catch (error) {
      console.log(error);
    }
  });
});

// logout handling
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  user.username = "";
});

