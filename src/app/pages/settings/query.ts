import { gql } from "@apollo/client";

export const GET_SETTINGS_PAGE = gql`
    {
      settings {
        tariff {
          id
          name
          serviceId
          service {
            id
            name
            unit
          }
          price
          startDate
          endDate
        }
      }
    }
`;

export const GET_SERVICES_LIST = gql`
  query GetServicesList {
    services(take: 100, skip: 0) {
      list {
        id
        name
        unit
      }
    }
  }
`;

export const GET_TARIFF = gql`
  query getTariff($id: ID!){
    getTariff(id: $id) {
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
      name
      serviceId
      service {
        id
        name
        unit
      }
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
      name
      serviceId
      service {
        id
        name
        unit
      }
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
