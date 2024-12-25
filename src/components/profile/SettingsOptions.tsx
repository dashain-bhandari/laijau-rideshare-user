import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import Fontisto from '@expo/vector-icons/Fontisto';
import BottomModal from './BottomModal';
import SettingsModalContent from './SettingsModalContent';
import BottomModalWithOverlay from './ModalWithOverlay';
import { ProfileStyles } from './ProfileStyles';
import { useTranslation } from 'react-i18next';

const SettingsOptions = (
    {modalVisible,setModalVisible}:{
        modalVisible:boolean,setModalVisible:Dispatch<SetStateAction<boolean>>
    }
) => {

    const {t}=useTranslation()
  return (
  <>
    <View style={ProfileStyles.container}>
    <View>
        <Text style={ProfileStyles.titleStyle}>{t('settings')}</Text>
    </View>
    <View style={ProfileStyles.itemContainer}>
        {/* language */}
        <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
            setModalVisible(true);
            console.log("hiiii")
        }
        }>
            <View style={{ marginRight: 10 }}>
                <Fontisto name="world" size={24} color="#666" />
            </View>
            <Text>{t('language')}</Text>
        </Pressable>

    </View>
</View>
 <BottomModalWithOverlay modalVisible={modalVisible}>
 <SettingsModalContent modalVisible={modalVisible} setModalVisible={setModalVisible}/>
</BottomModalWithOverlay>
  </>
  )
}

export default SettingsOptions

const styles = StyleSheet.create({
   
  
})