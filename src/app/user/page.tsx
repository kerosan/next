import { Suspense } from "react";
import { PreloadQuery, query } from "../ApolloClientRSC";
import { GET_USUERS_PAGE } from "./user.gql";

import { UserTable } from "./UserTable";
import { SEARCH_ADDRESS } from "@/graphql/query/address";

export default async function Page() {
  // const onSearchAddress = async(text: string) => {
  //   const ret = await query({ query: SEARCH_ADDRESS, variables: { text } });
  //   return ret.data
  // };

  return (
    <>
      <PreloadQuery query={GET_USUERS_PAGE}>
        <Suspense fallback={<>loading</>}>
          <UserTable  />
        </Suspense>
      </PreloadQuery>
    </>
  );
}
