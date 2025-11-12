import { ServiceTable } from "./ServiceTable";
import { onCreate, onUpdate, onDelete } from "./action";

export default function ServicePage() {
  return (
    <ServiceTable
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
}
