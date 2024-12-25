import { Pressable, StyleSheet, Text, View, Modal, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import colors from '../../utils/data/colors'
import { AxiosInstance } from '../../config/AxiosInstance'
import { useDispatch } from 'react-redux'
import { setUser } from '../../state/user/userSlice'
import { useTranslation } from 'react-i18next'

const EmergencyContactModal = ({ visible, onClose, onSave }: any) => {

    const [phone, setPhone] = useState('')
    const dispatch = useDispatch();
    const handleSave = async () => {

        try {
            const { data } = await AxiosInstance.patch("user/");
            if (data.data) {
                setPhone('')
                dispatch(setUser(data.data));
                onClose()
            }

        } catch (error) {
            Alert.alert("Something went wrong!")
            onClose()
        }
    }

    const {t}=useTranslation()
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{t('emergencyContact')}</Text>
                        <Pressable onPress={onClose}>
                            <AntDesign name="close" size={24} color="#666" />
                        </Pressable>
                    </View>



                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <Pressable style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>{t('saveEmergency')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16
    },
    saveButton: {
        backgroundColor: colors.primary[500],
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600'
    }
})

export default EmergencyContactModal
