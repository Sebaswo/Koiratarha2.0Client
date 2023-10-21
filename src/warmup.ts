import { doGraphQLFetch } from "./graphql/fetch"
import { userByUsername } from "./graphql/queries";

const apiURL = import.meta.env.VITE_API_URL;

await doGraphQLFetch(apiURL, userByUsername, {username: ""})

export {}