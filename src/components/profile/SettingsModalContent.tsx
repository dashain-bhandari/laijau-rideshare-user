
import { StyleSheet, Text, View, Image, Pressable, Dimensions } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'

import Octicons from '@expo/vector-icons/Octicons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useTranslation } from 'react-i18next'
import * as SecureStore from "expo-secure-store";

import colors from '../../utils/data/colors';

const SettingsModalContent = ({modalVisible,setModalVisible}:{
    modalVisible:boolean,setModalVisible:Dispatch<SetStateAction<boolean>>
}) => {
    const { i18n, t } = useTranslation();
   
    const [language, setLanguage] = useState<string>()
    const onChangeLanguage = async (lang: string) => {
        if (lang != language) {
          
            await SecureStore.setItemAsync("language",lang)
            setLanguage(lang);
            i18n.changeLanguage(lang)
            // Updates.reloadAsync()
        }
    }
    useEffect(() => {
        const loadLanguage = async () => {
            let lang = await SecureStore.getItemAsync("language")
            lang && setLanguage(lang);
        }
        loadLanguage()
    }, [])
  return (
    <View style=
    {{
        marginTop: 10,
        paddingHorizontal: 16
    }}>
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Text>Language Settings </Text>
        <Pressable onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color="#999" />
        </Pressable>

    </View>
    <View style={{ marginTop: 10 }}>
        <Pressable style={{ borderBottomColor: "#ccc", borderBottomWidth: 1, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={() => {
            onChangeLanguage("en-NP")
            setModalVisible(false)
        }}>
            <Text>English</Text>
            {
                language == "en-NP" && (
                    <AntDesign name="checkcircle" size={24} color={colors.secondary[500]} />
                )
            }
        </Pressable>
        <Pressable style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={() => {
            onChangeLanguage("ne-NP")
            setModalVisible(false)
        }

        }
        >
            <Text>Nepali</Text>
            {
                language == "ne-NP" && (
                    <AntDesign name="checkcircle" size={24} color={colors.secondary[500]} />
                )
            }
        </Pressable>
    </View>
</View>
  )
}

export default SettingsModalContent

const styles = StyleSheet.create({
   
})