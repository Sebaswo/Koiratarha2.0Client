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
import { FavouriteLocation } from "../../src/interfaces/FavouriteLocation"

// Global variables
const apiURL = import.meta.env.VITE_API_URL;
// const socketURL = import.meta.env.VITE_SOCKET_URL;
const token = localStorage.getItem("token")!;
const userId = localStorage.getItem("userId");

updateFavourites()
updateNotifications()
const user: User = {};

// notification handling
const addNotificationBtn = document.querySelector("#addNotification");
const removeNotificationBtn = document.querySelector("#removeNotification");

addNotificationBtn!.addEventListener("click", async () => {
  const timeForm = document.querySelector("#timeForm") as HTMLFormElement;
  const locName = document.querySelector("#name")?.textContent;
  const time = timeForm.querySelector("#time") as HTMLInputElement;
  const timeInput = time.value;
  // try {
  //   const notificationId = await doGraphQLFetch(
  //     apiURL,
  //     notificationsByUser,
  //     { userId },
  //     token!
  //   );
  console.log("AIKA AIKA ", timeInput)
    try {
      const notification = await doGraphQLFetch(
        apiURL,
        addNotification,
        {
          locName: locName,
          time: timeInput
        },
        token!
      );
      console.log(notification);
      // document.querySelector("#place1")!.innerHTML = locName!.innerHTML;
      // document.querySelector("#place2")!.innerHTML = time!.innerHTML;
      // document.querySelector("time")!.innerHTML = "";
    } catch (error) {
      console.log(error);
    }
    updateNotifications()
});

removeNotificationBtn!.addEventListener("click", async () => {
  let noteToDelete: string = "";
  const radioButtons = document.querySelectorAll<HTMLInputElement>('input[name="note"]')
  for (const radio of radioButtons) {
    if (radio.checked) {
      noteToDelete = radio.value;
    }
  }
    try {
      const removeNotification = await doGraphQLFetch(
        apiURL,
        deleteNotification,
        { deleteNotificationId: noteToDelete },
        token!
      );
      console.log(removeNotification);
    } catch (error) {
      console.log(error);
    }
    updateNotifications();
});

// favourite location handling
const favouriteButton = document.querySelector("#faveBtn");

favouriteButton!.addEventListener("click", async () => {
  const locName = document.querySelector("#name")?.textContent;
  const locAddress = document.querySelector("#address")?.textContent;
  const locCity = document.querySelector("#city")?.textContent;
  try {
      const favouriteLocation = (await doGraphQLFetch(
        apiURL,
        addFavourite,
        { 
          locName: locName,
          address: locAddress,
          city: locCity 
        },
        token
      )) as FavouriteLocation;
      console.log(favouriteLocation);
    } catch (error) {
      console.log(error);
    }
  updateFavourites();
});

const removeFaveButton = document.querySelector("#removeFaveBtn");

removeFaveButton!.addEventListener("click", async () => {
  const locAddress = document.querySelector("#address")?.textContent;
  let locationId: string = "";
  const locations = await doGraphQLFetch(
    apiURL,
    locationsByUser,
    { userId: userId },
    token!
  );

  for(let i = 0; i < locations.favouritesByUser.length; i++) {
    if (locAddress === locations.favouritesByUser[i].address) {
      locationId = locations.favouritesByUser[i].id;
    }
  }

  try {
    const deleteFavourite = await doGraphQLFetch(
      apiURL,
      deleteLocation,
      { deleteFavouriteId: locationId },
      token!
    );
    console.log(deleteFavourite);
  } catch (error) {
    console.log(error);
  }
  updateFavourites();
});

async function updateNotifications() {
  const notifications = await doGraphQLFetch(
    apiURL,
    notificationsByUser,
    { userId: userId },
    token!
  );
  console.log(notifications)

      // Storing the table element
  const tableElement = document.querySelector('#notificationsAll');

  // Generated HTML
  let generated = '';

  // Iterate over the list
  for(let i = 0; i < notifications.notificationsByUser.length; i++) {
    let dat = notifications.notificationsByUser[i].loc_name;
    let time = notifications.notificationsByUser[i].time;
    let id = notifications.notificationsByUser[i].id;
    console.log("IDDDD", id)
    // Generating HTML with data
    generated += `
      <tr>
        <td>${dat}</td>
        <td>${time}</td>
        <td><input type="radio" name="note" value="${id}"></td>
      </tr>`
  }

  // Appending it to the <table> element
  tableElement!.innerHTML = generated;
}

async function updateFavourites() {
  const locations = await doGraphQLFetch(
    apiURL,
    locationsByUser,
    { userId: userId },
    token!
  );
  console.log(locations);
  // Storing the table element
  const tableElement = document.querySelector('#favList');

  // Generated HTML
  let generated = '';

  // Iterate over the list
  for(let i = 0; i < locations.favouritesByUser.length; i++) {
    let dat = locations.favouritesByUser[i].loc_name;
    
    // Generating HTML with data
    generated += `
      <li>
        <p>${dat}</p>
      </li>`
  }

  // Appending it to the <table> element
  tableElement!.innerHTML = generated;
}
