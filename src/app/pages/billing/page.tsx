import { Suspense } from "react";
import { BillingTable } from "./BillingTable";
import { onCreate, onDelete, onUpdate } from "./action";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <BillingTable
        onDelete={onDelete}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </Suspense>
  );
}
