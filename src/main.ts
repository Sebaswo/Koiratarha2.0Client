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
  addNotification,
  deleteNotification,
  notificationsByUser,
  //allNotifications,
  addFavourite,
  deleteLocation,
  //allLocations,
  locationsByUser,
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

const nappula = document.querySelector(
  "#nappula"
) as HTMLButtonElement;

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
// loginButton.addEventListener("click", async () => {
//   console.log('ree');
//   const loginForm = document.querySelector("#userContent") as HTMLFormElement;
//   loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const username = loginForm.querySelector("#username") as HTMLInputElement;
//     const password = loginForm.querySelector("#password") as HTMLInputElement;

//     const credentials = {
//       username: username.value,
//       password: password.value,
//     };

//     try {
//       const loginData = (await doGraphQLFetch(apiURL, login, {
//         credentials,
//       })) as LoginMessageResponse;
//       console.log(loginData);
//       localStorage.setItem("token", loginData.token!);
//       user.username = loginData.user.username!;
//       window.location.href = 'dogPark.html';
//     } catch (error) {
//       console.log(error);
//     }
//   });
// });

// logout handling
// logoutButton.addEventListener("click", () => {
//   localStorage.removeItem("token");
//   user.username = "";
// });

// registering a new account
// registerButton.addEventListener("click", () => {
//   console.log("testitesti")
// })

nappula.addEventListener("click", async () => {
  console.log("TESTII")
})
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

// notification handling
const addNotificationBtn = document.querySelector(
  "#addNotification"
) as HTMLButtonElement;
const removeNotificationBtn = document.querySelector(
  "#removeNotification"
) as HTMLButtonElement;

addNotificationBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const userId = user.id;
  const locName = document.querySelector("#name") as HTMLElement;
  const time = document.querySelector("#time") as HTMLElement;

  try {
    const notificationId = await doGraphQLFetch(
      apiURL,
      notificationsByUser,
      { userId },
      token!
    );
    console.log(notificationId);
    try {
      const notification = await doGraphQLFetch(
        apiURL,
        addNotification,
        { locName, time },
        token!
      );
      console.log(notification);
      document.querySelector("#place1")!.innerHTML = locName.innerHTML;
      document.querySelector("#place2")!.innerHTML = time.innerHTML;
      document.querySelector("time")!.innerHTML = "";
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

removeNotificationBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const userId = user.id;

  try {
    const notificationId = await doGraphQLFetch(
      apiURL,
      notificationsByUser,
      { userId },
      token!
    );
    console.log(notificationId);
    try {
      const removeNotification = await doGraphQLFetch(
        apiURL,
        deleteNotification,
        { notificationId },
        token!
      );
      console.log(removeNotification);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

// favourite location handling
const favouriteButton = document.querySelector("#faveBtn") as HTMLButtonElement;
const locName = document.querySelector("#name") as HTMLElement;
const locAddress = document.querySelector("#address") as HTMLElement;
const locCity = document.querySelector("#city") as HTMLElement;

favouriteButton.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const userId = user.id;

  try {
    const locationId = await doGraphQLFetch(
      apiURL,
      locationsByUser,
      { userId },
      token!
    );
    console.log(locationId);
    try {
      const favouriteLocation = await doGraphQLFetch(
        apiURL,
        addFavourite,
        { locName, locAddress, locCity },
        token!
      );
      console.log(favouriteLocation);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

const removeFaveButton = document.querySelector(
  "#removeFaveBtn"
) as HTMLButtonElement;

removeFaveButton.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const userId = user.id;

  try {
    const locationId = await doGraphQLFetch(
      apiURL,
      locationsByUser,
      { userId },
      token!
    );
    console.log(locationId);
    try {
      const deleteFavourite = await doGraphQLFetch(
        apiURL,
        deleteLocation,
        { locationId },
        token!
      );
      console.log(deleteFavourite);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});
