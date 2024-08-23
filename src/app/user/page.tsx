import { Suspense } from "react";
import { DELETE_USER, GET_USUERS_PAGE, SEARCH_ADDRESS } from "./user.gql";

import { UserTable } from "./UserTable";
import { PreloadQuery, query, getClient } from "@/lib/apolloClient";
import type { Address } from "@prisma/client";

export default async function Page() {
  const onSearch = async (text: string) => {
    "use server";

    const { data } = await getClient().query<{ address: Address[] }>({
      query: SEARCH_ADDRESS,
      variables: { text },
    });
    return data.address;
  };

  const onDelete = async (userId: string) => {
    "use server";
    console.log({ userId });

    const { errors } = await getClient().mutate({
      mutation: DELETE_USER,
      variables: { userId },
      // refetchQueries: [GET_USUERS_PAGE],
    });
    console.log({ errors });
  };

  return (
    <>
      <PreloadQuery query={GET_USUERS_PAGE}>
        <Suspense fallback={<>loading</>}>
          <UserTable onSearch={onSearch} onDelete={onDelete} />
        </Suspense>
      </PreloadQuery>
    </>
  );
}
