import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { doGraphQLFetch } from "./../../src/graphql/fetch";
import {
  addNotification,
  deleteNotification,
  notificationsByUser,
  addFavourite,
  deleteLocation,
  locationsByUser,
  userById,
} from "./../../src/graphql/queries";

// Global variables
const apiURL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token")!;
const userId = localStorage.getItem("userId");

updateFavourites()
updateNotifications()

//admin options
const isAdmin = (await doGraphQLFetch(
  apiURL,
  userById,
  {userByIdId: userId}
));

const adminListItem = document.getElementById("navContentPageAdmin") as HTMLLIElement;
const userListItem = document.getElementById("navContentPageUser") as HTMLLIElement;

if (isAdmin.userById.username === 'admin') {
  adminListItem!.style.display = 'block'; // Show the element
  userListItem!.style.display = 'none';
} else {
  adminListItem!.style.display = 'none'; // Hide the element
}

// notification handling
const addNotificationBtn = document.querySelector("#addNotification");
const removeNotificationBtn = document.querySelector("#removeNotification");

addNotificationBtn!.addEventListener("click", async () => {
  const timeForm = document.querySelector("#timeForm") as HTMLFormElement;
  const locName = document.querySelector("#name")?.textContent;
  const time = timeForm.querySelector("#time") as HTMLInputElement;
  const timeInput = time.value;
  const utcTimeDate = new Date(timeInput + "Z");
  try {
    await doGraphQLFetch(
      apiURL,
      addNotification,
      {
        locName: locName,
        time: utcTimeDate
      },
      token!
    );
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
      await doGraphQLFetch(
        apiURL,
        deleteNotification,
        { deleteNotificationId: noteToDelete },
        token!
      );
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
    await doGraphQLFetch(
      apiURL,
      addFavourite,
      {
        locName: locName,
        address: locAddress,
        city: locCity
      },
      token
    )
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
    await doGraphQLFetch(
      apiURL,
      deleteLocation,
      { deleteFavouriteId: locationId },
      token!
    );
  } catch (error) {
    console.log(error);
  }
  updateFavourites();
});

//Updating UI
async function updateNotifications() {
  const notifications = await doGraphQLFetch(
    apiURL,
    notificationsByUser,
    { userId: userId },
    token!
  );
  // This code found from https://stackoverflow.com/questions/66981149/dynamic-table-with-2-columns-based-on-array-length
  const tableElement = document.querySelector('#notificationsAll');

  let generated = '';

  for(let i = 0; i < notifications.notificationsByUser.length; i++) {
    let dat = notifications.notificationsByUser[i].loc_name;
    let time = notifications.notificationsByUser[i].time;
    let id = notifications.notificationsByUser[i].id;
    const isoTime = new Date(time).toLocaleDateString([], {hour:'2-digit', minute: '2-digit'});

    generated += `
      <tr>
        <td>${dat}</td>
        <td>${isoTime}</td>
        <td><input type="radio" name="note" value="${id}"></td>
      </tr>`
  }

  tableElement!.innerHTML = generated;
}
//Updating UI
async function updateFavourites() {
  const locations = await doGraphQLFetch(
    apiURL,
    locationsByUser,
    { userId: userId },
    token!
  );
  // This code found from https://stackoverflow.com/questions/66981149/dynamic-table-with-2-columns-based-on-array-length
  const tableElement = document.querySelector('#favList');

  let generated = '';

  for(let i = 0; i < locations.favouritesByUser.length; i++) {
    let dat = locations.favouritesByUser[i].loc_name;

    generated += `
      <li>
        <p>${dat}</p>
      </li>`
  }

  tableElement!.innerHTML = generated;
}
