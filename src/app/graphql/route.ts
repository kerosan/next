import schema from "./schema";
import { createYoga } from "graphql-yoga";

const handleRequest = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  fetchAPI: { Response },
  logging: "debug",
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};

export const config = {
  api: {
    bodyParser: false,
  },
};
