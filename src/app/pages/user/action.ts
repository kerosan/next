import type { Mutation, Query, User } from "@/graphql/resolvers-types";
import { getClient } from "@/lib/apolloClient";
import {
  CREATE_USER,
  DELETE_USER,
  GET_USUERS_PAGE,
  SEARCH_ADDRESS,
} from "./query";

export const onSearch = async (text: string) => {
  "use server";
  console.log("onSearchAddress", { text });

  return await getClient().query<{ searchAddress: Query["searchAddress"] }>({
    query: SEARCH_ADDRESS,
    variables: { text },
  });
};

export const onCreate = async (user: Partial<User>) => {
  "use server";
  console.log("onCreateUser", { user });

  return await getClient().mutate<Mutation["createUser"]>({
    mutation: CREATE_USER,
    variables: { user },
    refetchQueries: [{ query: GET_USUERS_PAGE }],
  });
};

export const onDelete = async (userId: string) => {
  "use server";
  console.log("onDeleteUser", { userId });

  return await getClient().mutate<Mutation["deleteUser"]>({
    mutation: DELETE_USER,
    variables: { userId },
    refetchQueries: [{ query: GET_USUERS_PAGE, variables: {} }],
  });
};
