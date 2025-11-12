import { MeterReadingTable } from "./MeterReadingTable";
import { onCreate, onDelete } from "./action";

export default function MeterReadingPage() {
  return (
    <MeterReadingTable
      onCreate={onCreate}
      onDelete={onDelete}
    />
  );
}
