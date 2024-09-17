import { Suspense } from "react";
import { DeviceTable } from "./DeviceTable";
import { onCreate, onDelete, onUpdate } from "./action";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <DeviceTable
        onDelete={onDelete}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </Suspense>
  );
}
