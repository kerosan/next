import { createSchema } from "graphql-yoga";
import { gql } from "@apollo/client";
import { resolvers } from "@/graphql/resolvers";
import schema from "@/graphql/schema.graphql";

export default createSchema({
  typeDefs: gql`${schema}`,
  resolvers,
});
