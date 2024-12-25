import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Fontisto } from '@expo/vector-icons'
import { ProfileStyles } from './ProfileStyles'
import AntDesign from '@expo/vector-icons/AntDesign';
import BottomModal from '../BottomModal';
import BottomModalWithOverlay from './ModalWithOverlay';
import EmergencyContactModal from './EmergencyContactModal';
import { useTranslation } from 'react-i18next';
const MoreOptions = (
  
) => {
    const [modalVisible, setModalVisible] = useState(false)

  const {t}=useTranslation()
  return (
    <View style={ProfileStyles.container}>
     <View>
        <Text style={ProfileStyles.titleStyle}>{t('more')}</Text>
    </View>
    <View style={ProfileStyles.itemContainer}>
        {/* language */}
        <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
           setModalVisible(true)
        }
        }>
            <View style={{ marginRight: 10 }}>
        
                <AntDesign name="contacts" size={24} color="#666" />
            </View>
            <Text>{t('emergencyContact')}</Text>
        </Pressable>
      
    </View>
    <EmergencyContactModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
       
      />
    </View>
  )
}

export default MoreOptions

const styles = StyleSheet.create({
   
})