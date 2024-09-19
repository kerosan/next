import { UpdateUserInput } from "./../../../graphql/resolvers-types";
import { gql } from "@apollo/client/core";

export const GET_BILLING_PAGE = gql`
  query BillingPage($take: Int!, $skip: Int!) {
    billing(take: $take, skip: $skip) {
      list {
        id
        userId
        user {
          id
          name
          email
          phone
          addressId
          address {
            id
            address
          }
        }
      }
      total
    }
  }
`;

export const GET_BILLING = gql`
  query getBilling($id: ID!){
    billing(id: $id) {
      id
      payment
      userId
      user {
        id
        name
        email
        phone
        addressId
        balance
        address {
          id
          address
        }
        deviceId
        device {
          id
          name
          initialValue
          startDate
          endDate
        }
      }
    }
  }
`;

export const CREATE_BILLING = gql`
  mutation CreateBilling($billing: CreateBillingInput!){
    createBilling(billing: $billing) {
      id
      userId
      payment
    }
  }
`;

export const UPDATE_BILLING = gql`
  mutation UpdateBilling($billing: UpdateBillingInput!){
    updateBilling(billing: $billing) {
      id
      userId
      payment
    }
  }
`;

export const DELETE_BILLING = gql`
  mutation DeleteBilling($billingId: Int){
    deleteBilling(billingId: $billingId)
  }
`;
