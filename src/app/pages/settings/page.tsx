import { Suspense } from "react";
// import { onCreate, onDelete, onUpdate } from "./action";
import { SettingsPage } from "./SettingsPage";
import { onCreateTariff, onDeleteTariff, onUpdateTariff } from "./action";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <SettingsPage
        onCreateTariff={onCreateTariff}
        onUpdateTariff={onUpdateTariff}
        onDeleteTariff={onDeleteTariff}
      />
    </Suspense>
  );
}
