import { gql } from "@apollo/client/core";

export const GET_USUERS = gql`
    {
        users {
            id
            name
            phone
            email
        }
    }
`;

export const GET_USUER = gql`
    query getUser($id: ID!) {
        user(id: $id) {
            id
            name
        }
    }
`;
