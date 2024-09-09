import { Suspense } from "react";
import {
  CREATE_USER,
  DELETE_USER,
  GET_USUERS_PAGE,
  SEARCH_ADDRESS,
} from "./query";

import { UserTable } from "./UserTable";
import { PreloadQuery, query, getClient } from "@/lib/apolloClient";
import type { Address, User } from "@prisma/client";
import { onCreateUser, onDeleteUser, onSearchAddress } from "./action";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <UserTable
        onSearchAddress={onSearchAddress}
        onDeleteUser={onDeleteUser}
        onCreateUser={onCreateUser}
      />
    </Suspense>
  );
}
