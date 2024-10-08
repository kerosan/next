import { gql } from "@apollo/client";

export const GET_USUERS_PAGE = gql`
    query GetUsersPage($take:Int!, $skip:Int!) {
      users(take: $take, skip:$skip) {
        list {
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
        total
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

export const UPDATE_USER = gql`
  mutation UpdateUser($user: UpdateUserInput){
    updateUser(user: $user) {
      id
      name
      phone
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: Int){
    deleteUser(userId: $userId)
  }
`;
