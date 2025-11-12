import { gql } from "@apollo/client";

export const GET_CONSUMPTION_REPORT = gql`
  query GetConsumptionReport($userId: Int!, $months: Int!) {
    consumptionReport(userId: $userId, months: $months) {
      userId
      userName
      totalConsumption
      averageMonthlyConsumption
      readings {
        period
        value
        consumption
        service
      }
    }
  }
`;

export const GET_DEBT_REPORT = gql`
  query GetDebtReport {
    debtReport {
      totalDebt
      overdueDebt
      billingCount
      overdueCount
      users {
        userId
        userName
        totalDebt
        dueCount
        overdueCount
      }
    }
  }
`;

export const GET_REVENUE_REPORT = gql`
  query GetRevenueReport($monthsBack: Int!) {
    revenueReport(monthsBack: $monthsBack) {
      totalRevenue
      totalBilled
      totalPaid
      collectionRate
      monthlyData {
        month
        billed
        paid
        collected
      }
      paymentMethods {
        method
        count
        amount
      }
    }
  }
`;
