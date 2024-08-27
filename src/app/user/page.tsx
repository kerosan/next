import { Suspense } from "react";
import {
  CREATE_USER,
  DELETE_USER,
  GET_USUERS_PAGE,
  SEARCH_ADDRESS,
} from "./user.gql";

import { UserTable } from "./UserTable";
import { PreloadQuery, query, getClient } from "@/lib/apolloClient";
import type { Address, User } from "@prisma/client";

export default async function Page() {
  const onSearchAddress = async (text: string) => {
    "use server";
    console.log("onSearchAddress", { text });

    const { data } = await getClient().query<{ address: Address[] }>({
      query: SEARCH_ADDRESS,
      variables: { text },
    });
    return data.address;
  };

  const onCreateUser = async (user: Partial<User>) => {
    "use server";
    console.log("onCreateUser", { user });

    const { data, errors } = await getClient().mutate({
      errorPolicy: "all",

      mutation: CREATE_USER,

      variables: { user },
      refetchQueries: [{ query: GET_USUERS_PAGE }],
    });
    console.log({ data, errors });
    return data;
  };

  const onDeleteUser = async (userId: string) => {
    "use server";
    console.log({ userId });

    const { data, errors } = await getClient().mutate({
      mutation: DELETE_USER,
      variables: { userId },
      refetchQueries: [{ query: GET_USUERS_PAGE, variables: {} }],
    });
    console.log({ data, errors });
  };

  return (
    // <PreloadQuery query={GET_USUERS_PAGE}>
    // {(queryRef) => (
    <Suspense fallback={<p>loading...</p>}>
      <UserTable
        // queryRef={queryRef}
        onSearchAddress={onSearchAddress}
        onDeleteUser={onDeleteUser}
        onCreateUser={onCreateUser}
      />
    </Suspense>
    // )}
    // </PreloadQuery>
  );
}
