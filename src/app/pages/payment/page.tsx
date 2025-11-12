import { PaymentTable } from "./PaymentTable";
import { onCreate, onDelete } from "./action";

export default function PaymentPage() {
  return (
    <PaymentTable
      onCreate={onCreate}
      onDelete={onDelete}
    />
  );
}
