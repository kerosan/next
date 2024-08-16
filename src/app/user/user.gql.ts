import { gql } from "@apollo/client";

export const GET_USUERS_PAGE = gql`
    {
        users {
            id
            name
            phone
            email
            address {
              id
              address
            }
            device {
                id
                name
            }
            balance
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
