import { gql } from "@apollo/client";

export const GET_READINGS_PAGE = gql`
  query GetReadingsPage($deviceId: Int!, $take: Int!, $skip: Int!) {
    readings(deviceId: $deviceId, take: $take, skip: $skip) {
      list {
        id
        deviceId
        device {
          id
          meterNumber
          service {
            name
            unit
          }
        }
        readingDate
        value
        consumption
        notes
      }
      total
    }
  }
`;

export const GET_DEVICES_FOR_READINGS = gql`
  query GetDevicesForReadings($take: Int!, $skip: Int!) {
    device(take: $take, skip: $skip) {
      list {
        id
        meterNumber
        service {
          id
          name
          unit
        }
        initialValue
        startDate
      }
      total
    }
  }
`;

export const CREATE_READING = gql`
  mutation CreateReading($reading: CreateMeterReadingInput!) {
    createReading(reading: $reading) {
      id
      deviceId
      readingDate
      value
      consumption
    }
  }
`;

export const DELETE_READING = gql`
  mutation DeleteReading($readingId: Int!) {
    deleteReading(readingId: $readingId)
  }
`;
