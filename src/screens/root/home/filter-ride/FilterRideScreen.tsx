import { FlatList, StyleSheet, Text, View, ScrollView, Image, Pressable, Dimensions, Alert } from 'react-native'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import CustomBottomSheet from '../../../../components/CustomBottomSheet'
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import Map from '../../../../components/Map'
import BackButton from '../../../../components/BackButton'
import { TouchableHighlight, TouchableOpacity } from 'react-native'

import { Feather } from '@expo/vector-icons'
import SelectDropdown from '../../../../components/SelectDropdown'
import ToggleSwitch, { IconType } from '../../../../components/ToggleSwitch'


import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import PriceInputModal from './PriceInputModal'
import { useNavigation } from '@react-navigation/native'
import colors from '../../../../utils/data/colors'
import { services } from '../../../../utils/data/services'
import StyledButton from '../../../../styled/StyledButton'
import { FilterRideScreenProps } from '../../../../types/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { setInitialPrice, setMinimumPrice, setOfferedPrice, setPreferredVehicle, setRideId, setVehicleType } from '../../../../state/rideRequest/rideRequestSlice'
import { SocketContext } from '../../../../context/SocketContext'

import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { database } from '../../../../../firebaseConfig'
import { v4 as uuidv4 } from 'uuid';
import { KNN } from '../../../../helpers/KNN'
import { calculatePricings } from '../../../../helpers/price'


const { height, width } = Dimensions.get("screen")

const ConfirmRide = ({ navigation }: FilterRideScreenProps) => {

    const socket = useContext(SocketContext)
    const [selectedLanguage, setSelectedLanguage] = useState<string | number>("any");
    const [displayOptions, setDisplayOptions] = useState<"flex" | "none">("none")
    const vehicleOptionsForBike = ["Bike", "Scooter", "Any"];
    const vehicleOptionsForCar = ["Taxi", "EV", "Any"];
    const [womanFilterOn, setWomanFilterOn] = useState(false);
    const [priceModal, setPriceModal] = useState(false);
    const { offeredPrice, initialPrice, minimumPrice, vehicleType, preferredVehicle,bookedForFriend,friendName,friendNumber } = useSelector((state: RootState) => state.rideRequest)
    const { user } = useSelector((state: RootState) => state.user)
    const { userLocation, destinationLocation } = useSelector((state: RootState) => state.location)

    const dispatch = useDispatch();

    const collectionRef = collection(database, "userRideRequests");

    const findNearestDrivers = async () => {
        try {
            const allDrivers: any = [];
            const q = query(collection(database, "driverLocations"));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                allDrivers.push(doc.data());
            });
            console.log("all drivers", allDrivers)
            const nearestDrivers = KNN(allDrivers, { location: { lat1: userLocation?.userLatitude, lon1: userLocation?.userLongitude }, preference: preferredVehicle, vehicleType }, 15);
            console.log("nearest drivers are: ", nearestDrivers);
            return nearestDrivers;

        } catch (error: any) {
            console.log("error finding nearest drivers: ", error.message);
        }
    }

    //save on userriderequests collection
    const onFindRidePress = async () => {

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

                let nearestDrivers = await findNearestDrivers();

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
                    scheduled: false,
                    nearestDrivers,
                    bookedForFriend,
                    friendName:friendName??"",
                    friendNumber:friendNumber??""

                })
            } catch (error) {
                console.log("error", error)
            }
        }
        navigation.navigate("FindRideScreen")
    }



    // check if already scheduled one ride
    const { scheduledRide } = useSelector((state: RootState) => state.scheduledRide)

    const scheduleRidePress = () => {

        if (!scheduledRide) {
            navigation.navigate("ScheduleRideScreen")
        } else {
            Alert.alert("You have already scheduled a ride.")
        }
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Pressable style={{ flex: 1 }} onPress={() => setPriceModal(false)}>
                <BackButton onPressHandler={() => {
                    navigation.goBack()
                }} />
                <Map />

            </Pressable>
            <CustomBottomSheet initialHeight={2} scrollable={false}>
                <ScrollView style={styles.container} >
                    <Pressable onPress={() => setDisplayOptions("none")}>

                        <FlatList ItemSeparatorComponent={() => <View style={{ marginRight: 20 }}></View>} horizontal data={services} renderItem={({ item }) => <VehicleList item={item} ></VehicleList>}>
                        </FlatList>

                        {/* choose preferred vehicle here */}
                        <View style={{ marginTop: 20, position: "relative" }}>

                            <Text>Preffered vehicle type</Text>
                            <View style={{ marginTop: 10 }}>
                                <Pressable onPress={() => {
                                    displayOptions == "none" ? setDisplayOptions("flex") : setDisplayOptions("none");

                                }}>
                                    <View style={styles.selectVehicleContainer}>
                                        <Text>{"Any"}</Text>
                                        <Feather size={20} name={displayOptions == "flex" ? "chevron-up" : "chevron-down"}></Feather>
                                    </View>
                                </Pressable>

                                {
                                    vehicleType == "Bike" ? (<SelectDropdown
                                        display={displayOptions}
                                        listOptions={vehicleOptionsForBike}

                                        onSelect={(item: string) => {
                                            dispatch(setPreferredVehicle(item))
                                        }}
                                        setDisplay={setDisplayOptions}
                                    ></SelectDropdown>) : (
                                        <SelectDropdown
                                            display={displayOptions}
                                            listOptions={vehicleOptionsForCar}

                                            onSelect={setSelectedLanguage}
                                            setDisplay={setDisplayOptions}
                                        ></SelectDropdown>
                                    )
                                }

                                {/* woman select */}
                                <View style={styles.connectWomenContainer}>
                                    <Text>Connect with women riders</Text>
                                    <ToggleSwitch icon={{ type: IconType.MaterialCommunityIcons, name: "face-woman-shimmer", size: 26 }} toggle={true} setToggle={() => { }} />
                                </View>
                                {/* price bargain */}
                                <Pressable
                                    pointerEvents='auto'
                                    style={styles.offerFareContainer} onPress={
                                        () => { setPriceModal(true) }

                                    }>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                        <Text style={{ marginRight: 5, fontSize: 16 }}>रु</Text>
                                        {/* 
eti khera no need to show requested price as request garepachi yo screen nai dekhidaina
*/}
                                        {
                                            (<>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontSize: 18 }}>{offeredPrice ?? initialPrice}</Text>
                                                    {/* {<Text style={{ color: "#555" }}> - Tap to offer your fare</Text>} */}
                                                </View>
                                            </>)
                                        }
                                        {
                                            (!offeredPrice || !initialPrice) && (<Text style={{ color: "#555" }}>{" Offer your fare"}</Text>)
                                        }

                                    </View>
                                    <View>
                                        <FontAwesome5 name="pencil-alt" size={18} color="#555" />
                                    </View>
                                </Pressable>




                                {/* buttonss */}
                                <View style={styles.buttonContainer}>

                                    <View style={{ flex: 2, marginRight: 10 }}>
                                        <StyledButton
                                            title='Find ride'
                                            buttonStyles={styles.findRideButton}
                                            textStyles={styles.findRideTextStyle}
                                            onPress={onFindRidePress}
                                        ></StyledButton>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <StyledButton
                                            title='Schedule ride'
                                            buttonStyles={styles.scheduleButton}
                                            onPress={scheduleRidePress}
                                        ></StyledButton>
                                    </View>
                                </View>
                            </View>

                        </View>


                    </Pressable>

                </ScrollView>
            </CustomBottomSheet>

            {/* price modal to input offered price */}
            <PriceInputModal
                setPriceModal={setPriceModal}
                priceModal={priceModal}
            />

        </GestureHandlerRootView>

    )
}

export default ConfirmRide

const styles = StyleSheet.create(
    {
        container: {
            paddingHorizontal: 16,
            marginTop: 20,
        },

        selectVehicleContainer: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
        connectWomenContainer: {
            marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between"
        }
        ,
        offerFareContainer:
            { marginTop: 20, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }
        ,
        buttonContainer: { flexDirection: "row", marginTop: 20, justifyContent: "center", alignItems: "center" }
        ,
        findRideButton: {
            backgroundColor: colors.primary[500],
            borderRadius: 20,

        },
        findRideTextStyle: {
            color: "#fff"
        },
        scheduleButton: {
            borderWidth: 1,
            borderColor: colors.primary[500],
            backgroundColor: "#fff",
            borderRadius: 20,

        },

    })

const VehicleList = ({ item }: { item: { title: string, image: any, route: any } }) => {
    const { title, route, image } = item;
    const { vehicleType, distanceInKm } = useSelector((state: RootState) => state.rideRequest)
    const { userLocation } = useSelector((state: RootState) => state.location)
    console.log("vehivcle type", vehicleType)
    const dispatch = useDispatch()

    return (
        // add animation to onpress later
        <TouchableOpacity activeOpacity={1} onPress={async () => {
            dispatch(setVehicleType(title))
            let { initialPrice, minimumPrice } = await calculatePricings({ distance: distanceInKm!, vehicleType: title!, coordinates: { latitude: userLocation?.userLatitude!, longitude: userLocation?.userLongitude! } })
            console.log("initia;", initialPrice)
            dispatch(setInitialPrice(initialPrice))
            dispatch(setMinimumPrice(minimumPrice))
            dispatch(setOfferedPrice(initialPrice));
        }}>
            <View style={{
                flexDirection: "column", padding: 10, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: vehicleType == title ? colors.primary[100] : "#fff"
            }}>
                <View style={{ width: 50, height: 50 }}>
                    <Image resizeMode='contain' source={image} style={{ width: 50, height: 50 }}></Image>
                </View>
                <Text>{title}</Text>
            </View>
        </TouchableOpacity>)
}