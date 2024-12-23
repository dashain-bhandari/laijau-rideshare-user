import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { TextInput } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../../utils/data/colors';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigation, RootStackParamList } from '../../../types/types';
import { TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';

const DestinationInput = () => {

    const navigation = useNavigation<HomeScreenNavigation>();
    const { t } = useTranslation();
    
    return (
        <TouchableWithoutFeedback
            onPress={() => navigation.navigate("FindDestinationScreen")}
        >
            <View style={{
                padding: 10, borderRadius: 10, borderWidth: 1,
                borderColor: "#ddd", flexDirection: "row", alignItems: "center",
                justifyContent: "space-between"
            }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ marginRight: 5 }}><Ionicons name="location" size={24} color={colors.secondary[600]} /></View>
                    <Text style={{ color: "#555" }}>{t('whereToGo')}?</Text>
                </View>

                <View style={{ marginRight: 5 }}><Ionicons name="search" size={20} color={"#333"} /></View>
            </View>
        </TouchableWithoutFeedback>
    )

}


export default DestinationInput

const styles = StyleSheet.create({})