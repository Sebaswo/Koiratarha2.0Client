import "bootstrap/dist/css/bootstrap.min.css";
import { doGraphQLFetch } from "../../src/graphql/fetch";
import {login} from "../../src/graphql/queries";
import LoginMessageResponse from "../../src/interfaces/LoginMessageResponse";
import { User } from "../../src/interfaces/User";

const apiURL = import.meta.env.VITE_API_URL;

const loginButton = document.querySelector(
  "#loginButton"
) as HTMLButtonElement;

//login handling
loginButton.addEventListener("click", async () => {
  console.log('api', apiURL);
  const loginForm = document.querySelector("#userContent") as HTMLFormElement;
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usernameForm = loginForm.querySelector("#username") as HTMLInputElement;
    const passwordForm = loginForm.querySelector("#password") as HTMLInputElement;

    const usernameInput = usernameForm.value;
    const passwordInput = passwordForm.value;

    try {
      const loginData = (await doGraphQLFetch(apiURL, login, {
        username: usernameInput,
        password: passwordInput,
      })) as LoginMessageResponse;
      localStorage.setItem("loginData", JSON.stringify(loginData.login));
      window.location.pathname = './pages/dogPark/index.html'
    } catch (error) {
      const loginInfo = document.querySelector("#loginInfo") as HTMLElement;
      if (loginInfo) {
        loginInfo.textContent = 'Väärä tunnus tai salasana';
      }
      console.log(error);
    }
  });
});

