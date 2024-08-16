import { Suspense } from "react";
import { GET_USUERS_PAGE, SEARCH_ADDRESS } from "./user.gql";

import { UserTable } from "./UserTable";
import { useQuery } from "@apollo/client";
import { PreloadQuery, query } from "@/lib/apolloClient";
import type { Address } from "@prisma/client";

export default async function Page() {
  const onSearch = async (text: string) => {
    "use server";

    const { data } = await query<{ address: Address[] }>({
      query: SEARCH_ADDRESS,
      variables: { text },
    });
    return data.address;
  };

  return (
    <>
      <PreloadQuery query={GET_USUERS_PAGE}>
        <Suspense fallback={<>loading</>}>
          <UserTable onSearch={onSearch} />
        </Suspense>
      </PreloadQuery>
    </>
  );
}
