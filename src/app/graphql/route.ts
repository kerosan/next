import schema from "./schema";
import { createYoga, type YogaServerInstance } from "graphql-yoga";

const handleRequest = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  fetchAPI: { Response },
  logging: "debug",
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const GET = (...args: any) => handleRequest.apply(this, args);
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const POST = (...args: any) => handleRequest.apply(this, args);
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const OPTIONS = (...args: any) => handleRequest.apply(this, args);

// export {
//   // handleRequest as GET,
//   handleRequest as POST,
//   handleRequest as OPTIONS,
// };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
