import { Suspense } from "react";
import { UserTable } from "./UserTable";
import {
  onCreate,
  onDelete,
  onSearchAddress,
  onSearchDevice,
  onUpdate,
} from "./action";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <UserTable
        onSearchAddress={onSearchAddress}
        onSearchDevice={onSearchDevice}
        onDelete={onDelete}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </Suspense>
  );
}
