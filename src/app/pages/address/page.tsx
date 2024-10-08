import { Suspense } from "react";
import { AddressTable } from "./AddressTable";
import { onCreate, onDelete, onSearchAddress, onUpdate } from "./action";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <AddressTable
        onSearchAddress={onSearchAddress}
        onDelete={onDelete}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </Suspense>
  );
}
