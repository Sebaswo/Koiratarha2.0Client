import { doGraphQLFetch } from "../../src/graphql/fetch"
import { createUser } from "../../src/graphql/queries"
import { Credentials } from "../../src/interfaces/Credentials"
import { User, UserIdWithToken } from "../../src/interfaces/User"

const apiURL = import.meta.env.VITE_API_URL;

const user: User = {};
const registerButton = document.querySelector(
  "#registerButton"
) as HTMLElement;

//login handling
registerButton.addEventListener("click", async (e) => {
  console.log('reeree');
  const registerForm = document.querySelector("#userContent") as HTMLFormElement;
  console.log("juu")
    console.log("jaa")
    e.preventDefault();
    const username = registerForm.querySelector("#username") as HTMLInputElement;
    const password = registerForm.querySelector("#password") as HTMLInputElement;
    console.log(username.value, password.value)

    const variables = {
        
            username: username.value,
            password: password.value
        
    };
    console.log(variables)

    try {
      const registerData = (await doGraphQLFetch(apiURL, createUser, {
        variables,
      })) as UserIdWithToken;
      console.log(registerData);
      localStorage.setItem("token", registerData.token!);
    //   user.username = registerData.user.username!;
      window.location.href = 'pages/dogPark/index.html';
    } catch (error) {
      console.log(error);
    }
});