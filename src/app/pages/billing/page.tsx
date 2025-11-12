import { Suspense } from "react";
import { BillingTable } from "./BillingTable";
import { BillingGenerator } from "./BillingGenerator";
import { onCreate, onDelete, onUpdate } from "./action";
import { Space } from "antd";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <BillingGenerator />
        <BillingTable
          onDelete={onDelete}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      </Space>
    </Suspense>
  );
}
