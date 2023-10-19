import "bootstrap/dist/css/bootstrap.min.css";
import {doGraphQLFetch} from "../../src/graphql/fetch";
import {updateUser, userByUsername} from "../../src/graphql/queries";
import ModifyMessageResponse from "../../src/interfaces/ModifyMessageResponse";

const apiURL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('token');
if (!token) {
  throw Error('user does not have a token')
}


const modifyButton = document.querySelector(
  "#modifyButton"
) as HTMLButtonElement;

modifyButton.addEventListener("click", async () => {
  const modifyForm = document.querySelector("#userContent") as HTMLFormElement;
  modifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usernameForm = modifyForm.querySelector("#username") as HTMLInputElement;
    const passwordForm = modifyForm.querySelector("#password") as HTMLInputElement;

    const usernameInput = usernameForm.value;
    const passwordInput = passwordForm.value;

    const existingUser = (await doGraphQLFetch(apiURL, userByUsername, {
      username: usernameInput
    }))

    if (!existingUser.userByUsername) {
      const modifyData = (await doGraphQLFetch(apiURL, updateUser,
        {user: {
        username: usernameInput,
        password: passwordInput
        }},
        token)) as ModifyMessageResponse;

      if (!modifyData.updateUser) {
        const modifyInfo = document.querySelector("#loginInfo") as HTMLElement;
        if (modifyInfo) {
          modifyInfo.textContent = 'Tietojen päivitys ei onnistunut';
        }
      } else {
        window.location.pathname = './pages/dogPark/index.html'
      }
    } else {
      const modifyInfo = document.querySelector("#modifyInfo") as HTMLElement;
      if (modifyInfo) {
        modifyInfo.textContent = `Käyttäjätunnus virheellinen. Valitse toinen.`;
      }
    }
  });
});
