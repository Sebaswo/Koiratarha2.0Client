// import "./style.css";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { doGraphQLFetch } from "./../../src/graphql/fetch";
import {
  //updateUser,
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
} from "./../../src/graphql/queries";
import { User } from "./../../src/interfaces/User";

// Global variables
const apiURL = import.meta.env.VITE_API_URL;
// const socketURL = import.meta.env.VITE_SOCKET_URL;

const user: User = {};

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
