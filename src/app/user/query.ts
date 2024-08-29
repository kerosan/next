import { gql } from "@apollo/client";

export const GET_USUERS_PAGE = gql`
    query GetUsersPage {
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

export const CREATE_USER = gql`
  mutation CreateUser($user: CreateUserInput){
    createUser(user: $user) {
      id
      name
      phone
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: String){
    deleteUser(userId: $userId)
  }
`;
