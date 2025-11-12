import { gql } from "@apollo/client";

export const GET_SERVICES_PAGE = gql`
  query GetServicesPage($take: Int!, $skip: Int!) {
    services(take: $take, skip: $skip) {
      list {
        id
        name
        unit
        tariffs {
          id
          name
          price
          startDate
          endDate
        }
      }
      total
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService($service: CreateServiceInput!) {
    createService(service: $service) {
      id
      name
      unit
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($service: UpdateServiceInput!) {
    updateService(service: $service) {
      id
      name
      unit
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($serviceId: Int!) {
    deleteService(serviceId: $serviceId)
  }
`;
