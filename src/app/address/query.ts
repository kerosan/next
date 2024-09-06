import { Address } from "@/graphql/resolvers-types";
import { gql } from "@apollo/client/core";

export const GET_ADDRESS_PAGE = gql`
  {
    address {
      id
      address
    }
  }
`;

export const SEARCH_ADDRESS = gql`
  query SearchAddress($text: String){
    searchAddress(text: $text) {
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

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($address: Address){
    createAddress(address: $address) {
      id
      address
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($addressId: Int){
    deleteAddress(addressId: $addressId){
      id
    }
  }
`;
