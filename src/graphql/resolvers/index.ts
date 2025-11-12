import type { Resolvers } from "@/graphql/resolvers-types";
import { Query } from "./query/index";
import { Mutation } from "./mutation/index";
import { User } from "./user/index";
import { GraphQLScalarType, Kind } from "graphql";

const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "ISO-8601 DateTime scalar",
  serialize(value) {
    // value comes from resolvers (Prisma Date)
  if (value instanceof Date) return value.toISOString();
  return new Date(value as any).toISOString();
  },
  parseValue(value) {
  return new Date(value as any);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const resolvers: Resolvers = {
  DateTime: DateTimeScalar as any,
  Query,
  User,
  Mutation,
};
