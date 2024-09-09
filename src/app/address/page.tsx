import { Suspense } from "react";
import { AddressTable } from "./AddressTable";
import { onCreate, onDelete, onSearch, onUpdate } from "./action";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <AddressTable
        onSearch={onSearch}
        onDelete={onDelete}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </Suspense>
  );
}
