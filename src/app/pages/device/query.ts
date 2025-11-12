import { gql } from "@apollo/client/core";

export const GET_DEVICE_PAGE = gql`
  query DevicePage($take:Int!, $skip:Int!) {
    device(take: $take, skip:$skip) {
      list {
        id
        meterNumber
        initialValue
        startDate
        endDate
        service {
          id
          name
          unit
        }
        userId
      }
      total
    }
  }
`;

export const SEARCH_DEVICE = gql`
  query SearchDevice($text: String){
    searchDevice(text: $text) {
      id
      meterNumber
      initialValue
      startDate
      endDate
      service {
        id
        name
        unit
      }
    }
  }
`;

export const GET_DEVICE = gql`
  query getDevice($id: ID!){
    getDevice(id: $id) {
      id
      meterNumber
      initialValue
      serviceId
    }
  }
`;

export const CREATE_DEVICE = gql`
  mutation CreateDevice($device: CreateDeviceInput!){
    createDevice(device: $device) {
      id
      meterNumber
      initialValue
      startDate
      endDate
      service {
        id
        name
      }
    }
  }
`;

export const UPDATE_DEVICE = gql`
  mutation UpdateDevice($device: UpdateDeviceInput!){
    updateDevice(device: $device) {
      id
      meterNumber
      initialValue
      startDate
      endDate
      service {
        id
        name
      }
    }
  }
`;

export const DELETE_DEVICE = gql`
  mutation DeleteDevice($deviceId: Int){
    deleteDevice(deviceId: $deviceId)
  }
`;
