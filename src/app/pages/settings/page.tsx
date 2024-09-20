import { Suspense } from "react";
// import { onCreate, onDelete, onUpdate } from "./action";
import { SettingsPage } from "./SettingsPage";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <SettingsPage />
    </Suspense>
  );
}
