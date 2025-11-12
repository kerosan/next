import { UpdateUserInput } from "./../../../graphql/resolvers-types";
import { gql } from "@apollo/client/core";

export const GET_BILLING_PAGE = gql`
  query BillingPage($take: Int!, $skip: Int!) {
    billing(take: $take, skip: $skip) {
      list {
        id
        userId
        billingPeriod
        currentReading
        previousReading
        consumption
        amount
        isPaid
        dueDate
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
        device {
          id
          meterNumber
          service {
            name
            unit
          }
        }
        tariff {
          id
          name
          price
        }
      }
      total
    }
  }
`;

export const GET_BILLING = gql`
  query getBilling($id: ID!){
    getBilling(id: $id) {
      id
      userId
      billingPeriod
      currentReading
      previousReading
      consumption
      amount
      isPaid
      dueDate
      user {
        id
        name
        email
        phone
        balance
        address {
          address
          city
        }
      }
      device {
        id
        meterNumber
        service {
          name
          unit
        }
      }
      tariff {
        id
        name
        price
      }
    }
  }
`;

export const CREATE_BILLING = gql`
  mutation CreateBilling($billing: CreateBillingInput!){
    createBilling(billing: $billing) {
      id
      userId
      billingPeriod
      consumption
      amount
      isPaid
      dueDate
    }
  }
`;

export const UPDATE_BILLING = gql`
  mutation UpdateBilling($billing: UpdateBillingInput!){
    updateBilling(billing: $billing) {
      id
      isPaid
    }
  }
`;

export const DELETE_BILLING = gql`
  mutation DeleteBilling($billingId: Int){
    deleteBilling(billingId: $billingId)
  }
`;

// Додатковий query для отримання останніх показань по лічильнику
export const GET_LAST_READINGS = gql`
  query GetLastReadings($deviceId: Int!, $take: Int!, $skip: Int!) {
    readings(deviceId: $deviceId, take: $take, skip: $skip) {
      list {
        id
        value
        readingDate
      }
      total
    }
  }
`;
