import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from '../../../../utils/data/colors';
import { FindDestinationNavigation } from '../../../../types/types';
import { useNavigation } from '@react-navigation/native';

const YourAddresses = () => {


    const navigation = useNavigation<FindDestinationNavigation>();
    const onViewAllPress = () => {
        navigation.navigate("AllAddressScreen")
    }
    return (
        <View>
            <View style={styles.headingContainer}>
                <Text>Your addresses</Text>
                <TouchableOpacity onPress={onViewAllPress}><Text style={{ color: "#777" }}>view all</Text></TouchableOpacity>
            </View>
            {/* home */}
            <View style={styles.addressContainer}>
                <View style={styles.iconBackground}>
                    <Entypo name="home" size={24} color={"#555"} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.heading}>Home</Text>
                    <Text style={styles.address}> Set an address</Text>
                </View>
            </View>
            {/* work */}
            <View style={styles.addressContainer}>
                <View>
                    <View style={styles.iconBackground}>
                        <MaterialIcons name="work" size={24} color="#555" />
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.heading}>Work</Text>
                    <Text style={styles.address}>Set an address</Text>
                </View>
            </View>
        </View>
    )
}

export default YourAddresses

const styles = StyleSheet.create({
    container: {
        flexDirection: "column"
    },
    headingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    addressContainer: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        gap: 5
    },
    iconBackground: {
        backgroundColor: "#eee",
        borderRadius: 10,
        padding: 10
    },
    textContainer: {
        flexDirection: "column",
        gap: 2
    },
    heading: {

    },
    address: {

        color: "#555"
    }
})