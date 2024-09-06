import { Suspense } from "react";
import {
  CREATE_ADDRESS,
  DELETE_ADDRESS,
  GET_ADDRESS_PAGE,
  SEARCH_ADDRESS,
} from "./query";

import { PreloadQuery, query, getClient } from "@/lib/apolloClient";
import type { Address, User } from "@prisma/client";
import { AddressTable } from "./AddressTable";
import type { Query } from "@/graphql/resolvers-types";

export default async function Page() {
  const onSearchAddress = async (text: string) => {
    "use server";

    const { data, error } = await getClient().query<
      Pick<Query, "searchAddress">
    >({
      query: SEARCH_ADDRESS,
      variables: { text },
    });
    console.log("onSearchAddress", { text, data, error });

    return data.searchAddress;
  };

  const onCreateAddress = async (user: Partial<User>) => {
    "use server";
    console.log("onCreateUser", { user });

    const { data, errors } = await getClient().mutate({
      errorPolicy: "all",

      mutation: CREATE_ADDRESS,

      variables: { user },
      refetchQueries: [{ query: GET_ADDRESS_PAGE }],
    });
    console.log({ data, errors });
    return data;
  };

  const onDeleteAddress = async (addressId: string) => {
    "use server";
    console.log({ addressId });

    const { data, errors } = await getClient().mutate({
      mutation: DELETE_ADDRESS,
      variables: { addressId },
      refetchQueries: [{ query: GET_ADDRESS_PAGE, variables: {} }],
    });

    console.log({ data, errors });
  };

  return (
    <Suspense fallback={<p>loading...</p>}>
      <AddressTable
        onSearch={onSearchAddress}
        onDelete={onDeleteAddress}
        onCreate={onCreateAddress}
      />
    </Suspense>
  );
}
