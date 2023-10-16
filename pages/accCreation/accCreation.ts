import { doGraphQLFetch } from "../../src/graphql/fetch"
import { allUsers, createUser } from "../../src/graphql/queries"
import LoginMessageResponse from "../../src/interfaces/LoginMessageResponse";
import { User, UserIdWithToken } from "../../src/interfaces/User"

const apiURL = import.meta.env.VITE_API_URL;

const user: User = {};
const registerButton = document.querySelector(
  "#registerButton"
) as HTMLElement;

//login handling
registerButton.addEventListener("click", async (e) => {
  const registerForm = document.querySelector("#userContent") as HTMLFormElement;
  e.preventDefault();
  const username = registerForm.querySelector("#username") as HTMLInputElement;
  const password = registerForm.querySelector("#password") as HTMLInputElement;

  const nameInput = username.value;
  const passInput = password.value;
  try {
    const registerData = (await doGraphQLFetch(apiURL, createUser, {
        user: {
          username: nameInput,
          password: passInput
        }
    })) as LoginMessageResponse;
    localStorage.setItem("token", registerData.login?.token!);
    window.location.href = '../../pages/dogPark/index.html';
  } catch (error) {
    console.log(error);
  }
});