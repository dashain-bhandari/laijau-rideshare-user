import { Button, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'

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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { setOfferedPrice, setRideId } from '../../../../state/rideRequest/rideRequestSlice';
import { addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { database } from '../../../../../firebaseConfig';

const { width, height } = Dimensions.get("screen");

const ScheduleRideScreen = ({ navigation }: ScheduleRideScreenProps) => {
    const [modalVisible, setModalVisible] = useState(true);
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
    const [pickedOption, setPickedOption] = useState<Date | null>(null)
    const [universalTime, setUniversalTime] = useState<Date | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>("today");
    const {offeredPrice,initialPrice,vehicleType,preferredVehicle}=useSelector((state:RootState)=>state.rideRequest)
    const {user}=useSelector((state:RootState)=>state.user)
    const {userLocation,destinationLocation}=useSelector((state:RootState)=>state.location)
    const dispatch=useDispatch();
    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (date: Date) => {
        hideTimePicker();
        setUniversalTime(date);
        // date=new Date(date.setHours(date.getHours()+5,date.getMinutes()+45))

        console.log("date", date.toLocaleString());
        setSelectedTime(date.toLocaleTimeString().slice(0, 5))
    };

    const showDatePicker = () => {
        setDatePickerVisibility(!isDatePickerVisible);
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


    const handleDatePicker = (pickedOption: string) => {

        if (pickedOption == "today") {
            setSelectedDate(new Date().toLocaleDateString())
            setPickedOption(new Date())
        }
        else {
            let date = new Date();
            date.setDate(date.getDate() + 1)
            console.log("date", date.toDateString())
            setSelectedDate(date.toLocaleDateString())
            setPickedOption(date)
        }
    }

  
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (pickedOption && universalTime) {
            setIsValid(true);
        }
        else {
            setIsValid(false);
        }
    }, [pickedOption, universalTime])

    const onFideRidePress = async () => {
        if (pickedOption && universalTime) {
            const date = new Date(pickedOption?.getFullYear()!, pickedOption?.getMonth()!, pickedOption?.getDate()!, universalTime?.getHours()! , universalTime?.getMinutes());
            const alertDate = new Date(pickedOption?.getFullYear()!, pickedOption?.getMonth()!, pickedOption?.getDate()!, universalTime?.getHours()-1!, universalTime?.getMinutes());
            console.log("universal", date.toString());

            console.log("local", date.toLocaleString());
            console.log("alert",alertDate)

   //add request to the db
   if (user) {
    console.log("add")
    try {
        if (!offeredPrice) {
            dispatch(setOfferedPrice(initialPrice!));
        }
        // first delete any existing old requests in driverRideRequests of that user so, we can fetch fresh requests for this particular ride.
        const q = query(collection(database, "driverRideRequests"), where("userId", "==", user?.id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref)
        });

        // also delete user ko old requests

        let rideId = `ride${Date.now()}`;
        console.log("rideId", rideId)
        dispatch(setRideId(rideId));

        const queryUser = query(collection(database, "userRideRequests"), where("userId", "==", user?.id), where("rideId", "!=", rideId));
        const querySnapshotUser = await getDocs(queryUser);

        querySnapshotUser.forEach(async (doc) => {
            await deleteDoc(doc.ref)
        });

        // let nearestDrivers=await findNearestDrivers();

        await addDoc(collection(database, "userRideRequests"), {
            rideId: rideId,
            userId: user?.id,
            vehicleType,
            offeredPrice: offeredPrice ?? initialPrice,
            pickup: userLocation,
            dropoff: destinationLocation,
            status: 'pending',
            user,
            createdAt: serverTimestamp(),
            scheduledDate:date,
            scheduled:true
            // nearestDrivers

        })
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: (new Date(alertDate)).getTime() // fire at 11:10am (10 minutes before meeting)
        };
        // Create a trigger notification
        await notifee.createTriggerNotification(
            {
                title: 'Ride reminder',
                body: `Today at ${selectedTime}`,

               
                ios: {
                    critical: true
                }
            },
            trigger,
        );
    } catch (error) {
        console.log("error", error)
    }
}

            navigation.navigate("FindScheduledRideScreen", {
                alertDate,
                date,
                selectedTime
            })


          

        }

       

    }

   

    return (
        <View style={{ flex: 1 }}>
            <BackButton onPressHandler={() => { }} />
            <Map />
            <BottomModal modalVisible={modalVisible} initialHeight={2.80}>
                <View style={styles.modalContainer}>

                    <Text style={{ color: "#555", marginTop: 10 }}>Choose time within tomorrow you want to book a ride</Text>


                    {/* date picker */}
                    <Pressable style={styles.pressableContainer} onPress={showDatePicker}>
                        <View style={{ marginRight: 10 }}>
                            <AntDesign name="calendar" size={24} color="#888" />
                        </View>
                        <View>
                            <Text style={styles.datetimeText}>Date</Text>
                            <Text>{selectedDate ?? "Select a date"}</Text>
                        </View>
                    </Pressable>

                    {/* time picker */}
                    <Pressable style={styles.pressableContainer} onPress={showTimePicker}>
                        <View style={{ marginRight: 10 }}>
                            <Feather name="clock" size={24} color="#888" />
                        </View>
                        <View>
                            <Text style={styles.datetimeText}>Time</Text>
                            <Text>{selectedTime ?? "Select a time"}</Text>
                        </View>
                    </Pressable>


                    <StyledButton
                    disabled={!isValid}
                        buttonStyles={{ backgroundColor: isValid?colors.primary[500]:colors.primary[200], marginTop: 20 }}
                        textStyles={{ color: "#fff" }}
                        title="Find ride"
                        onPress={() => {
                            onFideRidePress()
                        }} />
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"

                        onConfirm={handleTimeConfirm}
                        onCancel={hideTimePicker}

                    />
                    {isDatePickerVisible && (<DatePicker isDatePickerVisible={isDatePickerVisible} setDatePickerVisibility={setDatePickerVisibility} handleDateConfirm={handleDatePicker} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />)}

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
    },
    datePicker: {
        position: "absolute",
        zIndex: 200,
        backgroundColor: "#fff",
        width: "100%",
        left: 17,
        top: 108,
        borderRadius: 10,

        flexDirection: "column",
        shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        padding: 10,

    },
    datePickerOption: {
        paddingVertical: 10,
        padding: 10,
        borderRadius: 10
    }
})

const DatePicker = ({ isDatePickerVisible, setDatePickerVisibility, handleDateConfirm, selectedOption, setSelectedOption }: {
    isDatePickerVisible: boolean,
    setDatePickerVisibility: React.Dispatch<React.SetStateAction<boolean>>,
    handleDateConfirm: (pickedOption: string) => void,
    selectedOption: string,
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>,

}) => {


    return (
        <Pressable style={styles.datePicker} >
            <TouchableOpacity style={[styles.datePickerOption, {

                backgroundColor: selectedOption == "today" ? colors.primary[100] : "#fff"
            }]} onPress={() => {
                setSelectedOption("today");
                handleDateConfirm("today");
                setDatePickerVisibility(false)

            }}>
                <Text>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    handleDateConfirm("tomorrow");
                    setDatePickerVisibility(false)
                    setSelectedOption("tomorrow");
                }}
                style={[styles.datePickerOption, { backgroundColor: selectedOption == "tomorrow" ? colors.primary[100] : "#fff" }]}>
                <Text>Tommorrow</Text>
            </TouchableOpacity>
        </Pressable>
    )
}