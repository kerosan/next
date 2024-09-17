import { gql } from "@apollo/client/core";

export const GET_DEVICE_PAGE = gql`
  query DevicePage($take:Int!, $skip:Int!) {
    device(take: $take, skip:$skip) {
      list {
        id
        name
        initialValue
        startDate
        endDate
      }
      total
    }
  }
`;

export const GET_DEVICE = gql`
  query getDevice($id: ID!){
    device(id: $id) {
      id
      name
      initialValue
    }
  }
`;

export const CREATE_DEVICE = gql`
  mutation CreateDevice($device: CreateDeviceInput!){
    createDevice(device: $device) {
      id
      name
      initialValue
      startDate
      endDate
    }
  }
`;

export const UPDATE_DEVICE = gql`
  mutation UpdateDevice($device: UpdateDeviceInput!){
    updateDevice(device: $device) {
      id
      name
      initialValue
      startDate
      endDate
    }
  }
`;

export const DELETE_DEVICE = gql`
  mutation DeleteDevice($deviceId: Int){
    deleteDevice(deviceId: $deviceId)
  }
`;
