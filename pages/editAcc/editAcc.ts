import "bootstrap/dist/css/bootstrap.min.css";
import {doGraphQLFetch} from "../../src/graphql/fetch";
import {updateUser} from "../../src/graphql/queries";
import ModifyMessageResponse from "../../src/interfaces/ModifyMessageResponse";

const apiURL = import.meta.env.VITE_API_URL;

const loginData = localStorage.getItem('loginData');
let userData;
if (loginData) {
  const parsedData = JSON.parse(loginData);
  userData = parsedData;
}
console.log(userData);
const user = userData.user;

const modifyButton = document.querySelector(
  "#modifyButton"
) as HTMLButtonElement;

modifyButton.addEventListener("click", async () => {
  console.log('api', apiURL);
  const modifyForm = document.querySelector("#userContent") as HTMLFormElement;
  modifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usernameForm = modifyForm.querySelector("#username") as HTMLInputElement;
    const passwordForm = modifyForm.querySelector("#password") as HTMLInputElement;

    const usernameInput = usernameForm.value;
    const passwordInput = passwordForm.value;

    const updatedValues = {
      username: usernameInput,
      password: passwordInput,
    }

    try {
      const modifyData = (await doGraphQLFetch(apiURL, updateUser, {updatedValues})) as ModifyMessageResponse;
      console.log(modifyData);
      localStorage.setItem("loginData", JSON.stringify(modifyData));
      user.username = modifyData.user.username;
      window.location.pathname = './pages/dogPark/index.html'
    } catch (error) {
      const modifyInfo = document.querySelector("#modifyInfo") as HTMLElement;
      if (modifyInfo) {
        modifyInfo.textContent = 'Tietojen päivitys ei onnistunut';
      }
      console.log(error);
    }
  });
});
