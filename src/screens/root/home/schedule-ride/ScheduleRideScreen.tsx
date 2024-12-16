import { Button, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import DateTimePickerModal from "react-native-modal-datetime-picker";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import BackButton from '../../../../components/BackButton';
import Map from '../../../../components/Map';
import BottomModal from '../../../../components/BottomModal';
import StyledButton from '../../../../styled/StyledButton';
import colors from '../../../../utils/data/colors';
import { ScheduleRideScreenProps } from '../../../../types/types';
import Notifications from '../../../../config/Notifications';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

const ScheduleRideScreen = ({ navigation }: ScheduleRideScreenProps) => {
    const [modalVisible, setModalVisible] = useState(true);
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (date: Date) => {
        hideTimePicker();
        // date=new Date(date.setHours(date.getHours()+5,date.getMinutes()+45))
        console.log("date", date.toLocaleString());
        setSelectedTime(date.toLocaleTimeString().slice(0, 5))
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date: Date) => {
        hideDatePicker();
        // date=new Date(date.setHours(date.getHours()+5,date.getMinutes()+45))
        console.log("date", date);
        setSelectedDate(date.toLocaleDateString())
    };


    const onScheduleRidePress = async () => {

        await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            vibration: true,
            vibrationPattern: [300, 500],
        });

        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: (new Date(Date.now() + 5 * 1000)).getTime() // fire at 11:10am (10 minutes before meeting)
        };
        // Create a trigger notification
        await notifee.createTriggerNotification(
            {
                title: 'Meeting with Jane',
                body: 'Today at 11:20am',

                android: {
                    channelId: channelId,
                },
                ios: {
                    critical: true
                }
            },
            trigger,
        );

    }

    const onFideRidePress = () => {

    }
    return (
        <View style={{ flex: 1 }}>
            <BackButton onPressHandler={() => { }} />
            <Map />
            <BottomModal modalVisible={modalVisible} initialHeight={4}>
                <View style={styles.modalContainer}>

                    <Text style={{ color: "#555", marginTop: 10 }}>Choose time within tomorrow you want to book a ride</Text>


                    {/* date picker */}
                    {/* <Pressable style={styles.pressableContainer} onPress={showDatePicker}>
                        <View style={{ marginRight: 10 }}>
                            <AntDesign name="calendar" size={24} color="#888" />
                        </View>
                        <View>
                            <Text style={styles.datetimeText}>Date</Text>
                            <Text>{selectedDate ?? new Date().toLocaleDateString([],)}</Text>
                        </View>
                    </Pressable> */}

                    {/* time picker */}
                    <Pressable style={styles.pressableContainer} onPress={showTimePicker}>
                        <View style={{ marginRight: 10 }}>
                            <Feather name="clock" size={24} color="#888" />
                        </View>
                        <View>
                            <Text style={styles.datetimeText}>Time</Text>
                            <Text>{selectedTime ?? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
                        </View>
                    </Pressable>


                    <StyledButton
                        buttonStyles={{ backgroundColor: colors.primary[500], marginTop: 20 }}
                        textStyles={{ color: "#fff" }}
                        title="Find ride"
                        onPress={() => {
                            onScheduleRidePress();
                        }} />
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"

                        onConfirm={handleTimeConfirm}
                        onCancel={hideTimePicker}

                    />

                </View>
            </BottomModal>
        </View>
    )
}

export default ScheduleRideScreen

const styles = StyleSheet.create({
    modalContainer: {
        marginTop: 20,
        paddingHorizontal: 16
    },
    pressableContainer: {
        borderRadius: 10, borderWidth: 1, borderColor: "#eee", padding: 10, marginTop: 20, flexDirection: "row", shadowColor: "#eee", backgroundColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 8
    },
    datetimeText: {
        color: "#555", marginBottom: 5
    }
})