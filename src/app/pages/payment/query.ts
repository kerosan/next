import { gql } from "@apollo/client";

export const GET_PAYMENTS_PAGE = gql`
  query GetPaymentsPage($take: Int!, $skip: Int!) {
    payments(take: $take, skip: $skip) {
      list {
        id
        userId
        user {
          id
          name
          email
          phone
          address {
            address
            city
          }
        }
        billingId
        billing {
          id
          billingPeriod
          amount
          isPaid
          device {
            meterNumber
            service {
              name
            }
          }
        }
        amount
        paymentMethod
        paymentDate
        reference
        notes
        createdAt
      }
      total
    }
  }
`;

export const SEARCH_PAYMENT = gql`
  query SearchPayment($reference: String!) {
    searchPayment(reference: $reference) {
      id
      userId
      user {
        name
      }
      billingId
      billing {
        billingPeriod
        amount
      }
      amount
      paymentMethod
      paymentDate
      reference
      notes
    }
  }
`;

export const GET_UNPAID_BILLINGS = gql`
  query GetUnpaidBillings($userId: Int!, $take: Int!, $skip: Int!) {
    unpaidBillings(userId: $userId, take: $take, skip: $skip) {
      list {
        id
        billingPeriod
        amount
        isPaid
        dueDate
        device {
          meterNumber
          service {
            name
          }
        }
      }
      total
    }
  }
`;

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($payment: CreatePaymentInput!) {
    createPayment(payment: $payment) {
      id
      userId
      billingId
      amount
      paymentMethod
      paymentDate
      reference
      notes
    }
  }
`;

export const DELETE_PAYMENT = gql`
  mutation DeletePayment($paymentId: Int!) {
    deletePayment(paymentId: $paymentId)
  }
`;
