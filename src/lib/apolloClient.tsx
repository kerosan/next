import { HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

// import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

// if (process.env.NODE_ENV === "development") {
//   // Adds messages only in a dev environment
//   loadDevMessages();
//   loadErrorMessages();
// }

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    // biome-ignore lint/complexity/noForEach: <explanation>
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),

    link: from([
      errorLink,
      new HttpLink({
        // this needs to be an absolute url, as relative urls cannot be used in SSR
        uri: process.env.API_URL,
        // you can disable result caching here if you want to
        // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
        fetchOptions: { cache: "no-store" },
      }),
    ]),
  });
});
