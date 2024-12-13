import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView, { Marker } from 'react-native-maps';

import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../utils/data/colors';

interface MapProps {
  destinationMarker?: boolean,
  pickupMarker?: boolean,
  confirmLocation?: () => void
}

export default function Map({ destinationMarker, pickupMarker, confirmLocation }: MapProps) {

  const fallBackAddress = {
    latitude: 27.721287793855186,
    longitude: 85.32420084332698

  }
  return (
    <MapView style={{ flex: 1 }}
      initialRegion={{
        latitude:fallBackAddress.latitude,
        longitude:  fallBackAddress.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}
      onRegionChange={confirmLocation}
    >



{/* 
      {
        destinationLatitude && destinationLongitude && (
          <Marker
            description="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude
            }}

          >
            <Ionicons name="location" size={36} color={colors.primary[600]} />
          </Marker>
        )
      } */}

    </MapView>
  )
}

const styles = StyleSheet.create({})