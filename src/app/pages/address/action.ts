import {
  CREATE_ADDRESS,
  DELETE_ADDRESS,
  GET_ADDRESS_PAGE,
  SEARCH_ADDRESS,
  UPDATE_ADDRESS,
} from "./query";
import { getClient } from "@/lib/apolloClient";
import type { Mutation, Query } from "@/graphql/resolvers-types";
import type { Address } from "@prisma/client";

export const onSearchAddress = async (text: string) => {
  "use server";
  console.log("onSearchAddress", { text });

  return await getClient().query<{ searchAddress: Query["searchAddress"] }>({
    query: SEARCH_ADDRESS,
    variables: { text },
  });
};

export const onCreate = async (address: Partial<Address>) => {
  "use server";
  console.log("onCreate", { address });

  const { data, errors } = await getClient().mutate<Mutation["createAddress"]>({
    errorPolicy: "all",

    mutation: CREATE_ADDRESS,

    variables: { address },
    refetchQueries: [{ query: GET_ADDRESS_PAGE }],
  });
  console.log({ data, errors });
  return data;
};

export const onUpdate = async (address: Partial<Address>) => {
  "use server";
  console.log("onUpdate", { address });

  const { data, errors } = await getClient().mutate<Mutation["updateAddress"]>({
    errorPolicy: "all",

    mutation: UPDATE_ADDRESS,

    variables: { address },
    refetchQueries: [{ query: GET_ADDRESS_PAGE }],
  });
  console.log({ data, errors });
  return data;
};

export const onDelete = async (addressId: string) => {
  "use server";
  console.log({ addressId });

  const { data, errors } = await getClient().mutate<Mutation["deleteAddress"]>({
    mutation: DELETE_ADDRESS,
    variables: { addressId },
    refetchQueries: [{ query: GET_ADDRESS_PAGE, variables: {} }],
  });

  console.log({ data, errors });
  return data;
};
