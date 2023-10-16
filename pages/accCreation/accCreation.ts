import { doGraphQLFetch } from "../../src/graphql/fetch"
import { allUsers, createUser, userByUsername } from "../../src/graphql/queries"
import LoginMessageResponse from "../../src/interfaces/LoginMessageResponse";
import RegisterMessageResponse from "../../src/interfaces/RegisterMessageResponse"
import { UserAndToken } from "../../src/interfaces/User"

const apiURL = import.meta.env.VITE_API_URL;

const user: UserAndToken = {};
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
    const existingUser = (await doGraphQLFetch(apiURL, userByUsername, {
      username: nameInput
    }))

    if (!existingUser.userByUsername) {
      const registerData = (await doGraphQLFetch(apiURL, createUser, {
          user: {
            username: nameInput,
            password: passInput
          }
      })) as RegisterMessageResponse;
      console.log("REFG: ",registerData, "   USER: ", registerData.createUser.data , "   TOKEN: ", registerData.createUser.token, "   MESG: ", registerData.createUser.message)
      // localStorage.setItem("token", registerData.login.token!);
      // window.location.href = '../../pages/dogPark/index.html';
    } else {
      const regInfo = document.querySelector("#regInfo") as HTMLElement;
      if (regInfo) {
        regInfo.textContent = `Käyttäjätunnus virheellinen. Valitse toinen.`;
      }
    }
  } catch (error) {
    console.log(error);
  }
});