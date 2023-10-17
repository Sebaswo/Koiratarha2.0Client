import "bootstrap/dist/css/bootstrap.min.css";
import {doGraphQLFetch} from "../../src/graphql/fetch";
import {deleteUser, userById} from "../../src/graphql/queries";
import {allUsers} from "../../src/graphql/queries";

const apiURL = import.meta.env.VITE_API_URL;
console.log(apiURL);

const token = localStorage.getItem('token');
if (!token) {
  throw Error('user does not have a token')
}

const userList = document.querySelector(
  "#userList"
) as HTMLElement;

const deleteUserButton = document.querySelector(
  "#deleteUserButton"
) as HTMLButtonElement;

//initializing the page
updateUsersList()

deleteUserButton.addEventListener('click', async () => {

  const radioButtons = document.querySelectorAll<HTMLInputElement>('input[name="userSelection"]');

  // Find the selected radio button
  let selectedId;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedId = radioButton.value;
      break;
    }
  }

  console.log(selectedId);

  if (selectedId) {
    const deletedUser = (await doGraphQLFetch(
      apiURL,
      deleteUser,
      { deleteUserId: selectedId },
      token!
    ));
    console.log('user deleted', deletedUser)
  } else {
    console.log('käyttäjän poisto ei onnistunut')
  }
  updateUsersList()
});

async function updateUsersList() {
  const fetchedUsers = (await doGraphQLFetch(
    apiURL, allUsers,
  ));

  const userArray = fetchedUsers.users;

  console.log(userArray);
  let counter = 0;
  let generated = '';

  userArray.forEach(user => {
    let name = user.username;
    let id = user.id;

    if (name !== 'admin') {
      generated += `
      <div class="deleteUserContainer">
        <label class="form-check-label">
          <input class="form-check-input" type="radio" name="userSelection" id="item${counter}" value="${id}">
          ${name}
        </label>
      </div>`
    }

    counter += 1;
  });

  userList!.innerHTML = generated;
}


