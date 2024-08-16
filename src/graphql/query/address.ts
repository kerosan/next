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

export const SEARCH_ADDRESS = gql`
  query searchAddress($text: String){
    address(text: $text) {
      id
      address
    }
  }
`;