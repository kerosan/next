import { gql } from "@apollo/client";

export const GET_SETTINGS_PAGE = gql`
    {
      settings {
        tariff {
          id
          price
          startDate
          endDate
        }
      }
    }
`;

export const GET_TARIFF = gql`
  query getTariff($id: ID!){
    tariff(id: $id) {
      id
      price
      startDate
      endDate
    }
  }
`;

export const CREATE_TARIFF = gql`
  mutation CreateTariff($tariff: CreateTariffInput!){
    createTariff(tariff: $tariff) {
      id
      price
      startDate
      endDate
    }
  }
`;

export const UPDATE_TARIFF = gql`
  mutation UpdateTariff($tariff: UpdateTariffInput!){
    updateTariff(tariff: $tariff) {
      id
      price
      startDate
      endDate
    }
  }
`;

export const DELETE_TARIFF = gql`
  mutation DeleteTariff($tariffId: Int){
    deleteTariff(tariffId: $tariffId)
  }
`;
