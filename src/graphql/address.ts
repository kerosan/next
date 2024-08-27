import { gql } from "@apollo/client/core";

export const GET_ADDREESS_PAGE = gql`
  {
    address {
      id
      address
    }
  }
`;

export const GET_ADDRESS = gql`
  query getAddress($id: ID!){
    address(id: $id) {
      id
      address
    }
  }
`;
