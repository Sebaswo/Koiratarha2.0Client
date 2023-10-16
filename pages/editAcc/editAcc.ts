import "bootstrap/dist/css/bootstrap.min.css";
import {doGraphQLFetch} from "../../src/graphql/fetch";
import {updateUser} from "../../src/graphql/queries";
import ModifyMessageResponse from "../../src/interfaces/ModifyMessageResponse";

const apiURL = import.meta.env.VITE_API_URL;

const loginData = localStorage.getItem('loginData');
console.log('login', loginData);
let userData;
if (loginData) {
  const parsedData = JSON.parse(loginData);
  userData = parsedData;
}
console.log('user', userData);
const userToken = userData.token;
console.log(userToken);

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


    const modifyData = (await doGraphQLFetch(apiURL, updateUser,
      {user: {
      username: usernameInput,
      password: passwordInput
      }},
      userToken)) as ModifyMessageResponse;

    console.log(modifyData);

    if (!modifyData.updateUser) {
      const modifyInfo = document.querySelector("#loginInfo") as HTMLElement;
      if (modifyInfo) {
        modifyInfo.textContent = 'Tietojen päivitys ei onnistunut';
      }
    } else {
      modifyData.updateUser.token = userToken;
      localStorage.setItem("loginData", JSON.stringify(modifyData.updateUser));
      console.log(modifyData.updateUser);
      window.location.pathname = './pages/dogPark/index.html'
    }
  });
});
