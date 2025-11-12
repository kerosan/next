import { Tabs } from "antd";
import type { FC } from "react";
import ConsumptionReport from "./ConsumptionReport";
import DebtReport from "./DebtReport";
import RevenueReport from "./RevenueReport";

const ReportsPage: FC = () => {
  const tabs = [
    {
      key: "consumption",
      label: "Витрати послуг",
      children: <ConsumptionReport />,
    },
    {
      key: "debt",
      label: "Борги абонентів",
      children: <DebtReport />,
    },
    {
      key: "revenue",
      label: "Доходи",
      children: <RevenueReport />,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Звіти та аналітика</h1>
      <Tabs items={tabs} />
    </div>
  );
};

export default ReportsPage;
