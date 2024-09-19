import type { Mutation, Query, User } from "@/graphql/resolvers-types";
import { getClient } from "@/lib/apolloClient";
import {
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from "./query";

export const onCreate = async (user: Partial<User>) => {
  "use server";
  console.log("onCreateUser", { user });

  return await getClient().mutate<Mutation["createUser"]>({
    mutation: CREATE_USER,
    variables: { user },
  });
};

export const onUpdate = async (user: Partial<User>) => {
  "use server";
  console.log("onUpdateUser", { user });

  return await getClient().mutate<Mutation["updateUser"]>({
    mutation: UPDATE_USER,
    variables: { user },
  });
};

export const onDelete = async (userId: string) => {
  "use server";
  console.log("onDeleteUser", { userId });

  return await getClient().mutate<Mutation["deleteUser"]>({
    mutation: DELETE_USER,
    variables: { userId },
  });
};
