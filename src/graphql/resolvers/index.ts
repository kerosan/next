import type { Resolvers } from "@/graphql/resolvers-types";
import { Query } from "./query/index";
import { Mutation } from "./mutation/index";
import { User } from "./user/index";

export const resolvers: Resolvers = {
  Query,
  User,
  Mutation,
};
