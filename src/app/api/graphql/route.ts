import type { NextApiRequest, NextApiResponse } from "next";
import { schema } from "./schema";
import { createYoga } from "graphql-yoga";
import prisma from "@/db/prisma";

const handleRequest = createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema,
  context: () => ({
    prisma,
  }),
  graphqlEndpoint: "/api/graphql",

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
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
