import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

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

export const getClient = async () => {
  // Create a fresh ApolloClient instance. Server actions call this and may
  // expect a new client per call.
  return new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: from([
      errorLink,
      new HttpLink({
        uri: process.env.API_URL || "/graphql",
        fetchOptions: { cache: "no-store" },
        // Ensure fetch is available in Node (Next provides global fetch)
        fetch: globalThis.fetch as any,
      }),
    ]),
  });
};

// Backwards-compatible named exports used elsewhere in the codebase.
export const query = async (options: any) => {
  const client = await getClient();
  return client.query(options);
};

// PreloadQuery is not used in this repo; export a noop to keep imports safe.
export const PreloadQuery = (_q: any, _vars?: any) => Promise.resolve();
