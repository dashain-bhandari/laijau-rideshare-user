import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SaveNewAddressScreenProps } from '../../../../types/types'
import SaveNewAddress from '../../../../components/SaveNewAddress'

const SaveNewAddressScreen = ({
    navigation, route
}: SaveNewAddressScreenProps) => {
    const { tag, address, selectedIcon } = route.params
    return (
        <SaveNewAddress tag={tag} address={address} selectedIcon={selectedIcon} />
    )
}

export default SaveNewAddressScreen

const styles = StyleSheet.create({})