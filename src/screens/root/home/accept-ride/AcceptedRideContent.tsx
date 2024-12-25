import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking } from 'react-native'
import colors from '../../../../utils/data/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigation } from '../../../../types/types';
import { database } from '../../../../../firebaseConfig';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { setOngoingRide } from '../../../../state/ongoingRide/ongoingRideSlice';
import StyledButton from '../../../../styled/StyledButton';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { setBookedRide } from '../../../../state/bookForFriend/bookForFriendSlice';
import { AxiosInstance } from '../../../../config/AxiosInstance';
import { TextInput } from 'react-native';
import { Rating } from 'react-native-ratings';


const AcceptedRideContent = ({tag,setShowRatingModal}:{tag:string,setShowRatingModal:Dispatch<SetStateAction<boolean>>}) => {


    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);


   
    console.log("tag in accepted ride:",tag)
    const { user } = useSelector((state: RootState) => state.user)
    const navigation = useNavigation<HomeScreenNavigation>();
    const onChatPress = () => {
        navigation.navigate("ChatScreen")
    }

    const onCallPress = () => {
        Linking.openURL(`tel:${ongoingRide?.driver?.mobileNumber}`)
    }

    const [loading, setLoading] = useState(false)
    const { ongoingRide } = useSelector((state: RootState) => state.ongoingRide)
    const { bookedForFriend } = useSelector((state: RootState) => state.bookedForFriend)
    const dispatch = useDispatch()
    useEffect(() => {
        if ( tag=="ongoingRide" && ongoingRide) {
            const docRef = doc(database, "rides", ongoingRide?.rideId);
            const unsubscribe = onSnapshot(docRef, (snapshot) => {
                console.log(snapshot.data())
                dispatch(setOngoingRide(snapshot.data()));
            })
            return unsubscribe
        }
        if ( tag=="bookedRide" && bookedForFriend) {
            const docRef = doc(database, "rides", bookedForFriend?.rideId);
            const unsubscribe = onSnapshot(docRef, (snapshot) => {
                console.log(snapshot.data())
                dispatch(setBookedRide(snapshot.data()));
            })
            return unsubscribe
        }
    }, [])

    useEffect(() => {
     const getData=async()=>{
        if (tag=="ongoingRide" && ongoingRide && ongoingRide?.status == "ended") {
            try {
                const docRef = doc(database, "rides", ongoingRide?.rideId);
                deleteDoc(docRef)
            

                console.log("ongoing ride ",ongoingRide?.rideId)
                //update ride in db, then show rating
              const data= await AxiosInstance.patch(`/ride/${ongoingRide?.rideId}`,{status:"ended"});
              console.log("data",data)
              setShowRatingModal(true); 
            } catch (error: any) {
                console.log("Error deleting ongoing ride: ", error?.message)
            }
        }
        if ( tag=="bookedRide" &&  bookedForFriend && bookedForFriend?.status == "ended") {
            try {
                const docRef = doc(database, "rides", bookedForFriend?.rideId);
                deleteDoc(docRef)
               

                 //update ride in db, then show rating
              const data= await AxiosInstance.patch(`/ride/${bookedForFriend?.rideId}`,{status:"ended"});
              console.log("data",data)

              setShowRatingModal(true); 
                // navigation.popTo("TabsScreen")
            } catch (error: any) {
                console.log("Error deleting ongoing ride: ", error?.message)
            }
        }
     }
     getData();
    }, [ongoingRide,bookedForFriend])

    const onCancelRequest = async () => {
        try {
            const queryUser = query(collection(database, "userRideRequests"), where("userId", "==", user?.id));
            const querySnapshotUser = await getDocs(queryUser);

            querySnapshotUser.forEach(async (doc) => {
                await deleteDoc(doc.ref)
            });
            navigation.popTo("TabsScreen");

        } catch (error: any) {
            console.log("error in canceling requests", error?.message)
        }
    }

    return (
        <ScrollView style={styles.container}>
            {
                loading ? (<>
                    <ActivityIndicator color={colors.primary[500]}></ActivityIndicator>
                </>) :
                   tag=="ongoingRide"? (<>
               
                    <View style={styles.headerContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={styles.dot}></View>
                            {
                                ongoingRide?.riderStatus !== "arrived" && (<Text>Rider is on the way to pickup</Text>)
                            }
                            {
                                ongoingRide?.riderStatus == "arrived" && ongoingRide?.status == "accepted" && (<Text>Waiting for driver to start the ride</Text>)
                            }
                            {
                                ongoingRide?.status == "started" && (<Text>The ride has started</Text>)
                            }
                        </View>
                        {/* share ride */}

                        <Pressable
                            style={{ flexDirection: "row", gap: 5, alignItems: "center", backgroundColor: colors.primary[100], paddingVertical: 5, borderRadius: 10, paddingHorizontal: 10 }}
                            onPress={async () => {
                                // Replace with your URL
                                const url = `https://ride-adminpanel.vercel.app/ride/${ongoingRide?.rideId}`;

                                // Check if the URL can be opened
                                const canOpen = await Linking.canOpenURL(url);

                                if (canOpen) {
                                    await Linking.openURL(url);
                                } else {
                                    console.log('Cannot open URL');

                                }
                            }}
                        >

                            <FontAwesome6 name="share" size={24} color={colors.primary[500]} />
                            <Text style={{ color: colors.primary[700] }}>Share ride</Text>
                        </Pressable>
                    </View>
                    {/* vehicle details */}
                    <View style={styles.vehicleDetailContainer}>
                        <View style={styles.vehicleColumnContainer}>
                            <Text style={{ fontWeight: 600, fontSize: 18 }}>
                                {ongoingRide?.driver?.vehicleRegistrationNumber}
                            </Text>
                            <Text style={{ color: "#555", marginTop: 4 }}>
                                {ongoingRide?.driver?.vehicleName}
                            </Text>
                        </View>
                    </View>
                    {/* rider details */}
                    <View style={styles.riderDetails}>
                        <View style={styles.imageContainer}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", borderRadius: 100 }}>
                                <Text style={{ color: "#fff", fontSize: 30 }}>{ongoingRide?.driver?.fullName?.slice(0, 1)}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "column" }}>
                            <Text>
                                {ongoingRide?.driver?.fullName}
                            </Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                <View style={styles.ratingContainer}>
                                    <View style={{ marginRight: 5 }}>
                                        <FontAwesome name="star" size={18} color={colors.secondary[400]} />
                                    </View>
                                    <Text style={{ color: "#888" }}>4.57</Text>
                                </View>
                                <View style={styles.separationLine}>

                                </View>
                                <Text style={{ color: "#888" }}>
                                    254 trips
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* chat and call  */}
                    <View style={styles.contactContainer}>

                        <Pressable style={styles.chatContainer}
                            onPress={onChatPress}
                        >
                            <View style={{ marginRight: 10 }}>
                                <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary[500]} />
                            </View>
                            <Text style={{ color: "#888" }}>Pickup notes for rider</Text>
                        </Pressable>
                        <Pressable style={styles.callContainer}
                            onPress={onCallPress}
                        >
                            <Ionicons name="call" size={24} color={colors.primary[500]} />
                        </Pressable>
                    </View>


                    {/* emergency services */}
                    {
                        ongoingRide && ongoingRide?.status == "started" && (
                            <Pressable
                                onPress={() => {
                                    if (user && user.emergencyContact) {
                                        Linking.openURL(`tel:${user.emergencyContact
                                            }`)
                                    }
                                    else {
                                        Linking.openURL(`tel:${"100"
                                            }`)
                                    }
                                }}
                                style={{ marginHorizontal: 16, borderRadius: 10, padding: 10, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10, backgroundColor: colors.secondary[100], marginTop: 20 }}>

                                <Ionicons name="alert-circle" size={24} color={colors.secondary[500]} />
                                <Text style={{ color: colors.secondary[600] }}>Emergency Services</Text>
                            </Pressable>
                        )
                    }

                    {
                        (ongoingRide?.status !== "started" && ongoingRide?.status !== "ended") && (
                            <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                                <StyledButton

                                    buttonStyles={{ backgroundColor: "#eee", marginTop: 20, marginBottom: 20 }}
                                    textStyles={{ color: colors.secondary[600] }}
                                    title='Cancel request'
                                    onPress={() => { onCancelRequest() }}
                                />
                            </View>
                        )
                    }

                </>)
                : 
                (<>
           
                        <View style={styles.headerContainer}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={styles.dot}></View>
                                {
                                    bookedForFriend?.riderStatus !== "arrived" && (<Text>Rider is on the way to pickup</Text>)
                                }
                                {
                                    bookedForFriend?.riderStatus == "arrived" && bookedForFriend?.status == "accepted" && (<Text>Waiting for driver to start the ride</Text>)
                                }
                                {
                                    bookedForFriend?.status == "started" && (<Text>The ride has started</Text>)
                                }
                            </View>
                            {/* share ride */}

                            <Pressable
                                style={{ flexDirection: "row", gap: 5, alignItems: "center", backgroundColor: colors.primary[100], paddingVertical: 5, borderRadius: 10, paddingHorizontal: 10 }}
                                onPress={async () => {
                                    // Replace with your URL
                                    const url = `https://ride-adminpanel.vercel.app/ride/${bookedForFriend?.rideId}`;

                                    // Check if the URL can be opened
                                    const canOpen = await Linking.canOpenURL(url);

                                    if (canOpen) {
                                        await Linking.openURL(url);
                                    } else {
                                        console.log('Cannot open URL');

                                    }
                                }}
                            >

                                <FontAwesome6 name="share" size={24} color={colors.primary[500]} />
                                <Text style={{ color: colors.primary[700] }}>Share ride</Text>
                            </Pressable>
                        </View>
                        {/* vehicle details */}
                        <View style={styles.vehicleDetailContainer}>
                            <View style={styles.vehicleColumnContainer}>
                                <Text style={{ fontWeight: 600, fontSize: 18 }}>
                                    {bookedForFriend?.driver?.vehicleRegistrationNumber}
                                </Text>
                                <Text style={{ color: "#555", marginTop: 4 }}>
                                    {bookedForFriend?.driver?.vehicleName}
                                </Text>
                            </View>
                        </View>
                        {/* rider details */}
                        <View style={styles.riderDetails}>
                            <View style={styles.imageContainer}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", borderRadius: 100 }}>
                                    <Text style={{ color: "#fff", fontSize: 30 }}>{bookedForFriend?.driver?.fullName?.slice(0, 1)}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "column" }}>
                                <Text>
                                    {bookedForFriend?.driver?.fullName}
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                    <View style={styles.ratingContainer}>
                                        <View style={{ marginRight: 5 }}>
                                            <FontAwesome name="star" size={18} color={colors.secondary[400]} />
                                        </View>
                                        <Text style={{ color: "#888" }}>4.57</Text>
                                    </View>
                                    <View style={styles.separationLine}>

                                    </View>
                                    <Text style={{ color: "#888" }}>
                                        254 trips
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* chat and call  */}
                        <View style={styles.contactContainer}>

                            <Pressable style={styles.chatContainer}
                                onPress={onChatPress}
                            >
                                <View style={{ marginRight: 10 }}>
                                    <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary[500]} />
                                </View>
                                <Text style={{ color: "#888" }}>Pickup notes for rider</Text>
                            </Pressable>
                            <Pressable style={styles.callContainer}
                                onPress={onCallPress}
                            >
                                <Ionicons name="call" size={24} color={colors.primary[500]} />
                            </Pressable>
                        </View>


                        {/* emergency services */}
                        {
                            bookedForFriend && bookedForFriend?.status == "started" && (
                                <Pressable
                                    onPress={() => {
                                        if (user && user.emergencyContact) {
                                            Linking.openURL(`tel:${user.emergencyContact
                                                }`)
                                        }
                                        else {
                                            Linking.openURL(`tel:${"100"
                                                }`)
                                        }
                                    }}
                                    style={{ marginHorizontal: 16, borderRadius: 10, padding: 10, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10, backgroundColor: colors.secondary[100], marginTop: 20 }}>

                                    <Ionicons name="alert-circle" size={24} color={colors.secondary[500]} />
                                    <Text style={{ color: colors.secondary[600] }}>Emergency Services</Text>
                                </Pressable>
                            )
                        }

                        {
                            (bookedForFriend?.status !== "started" && bookedForFriend?.status !== "ended") && (
                                <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                                    <StyledButton

                                        buttonStyles={{ backgroundColor: "#eee", marginTop: 20, marginBottom: 20 }}
                                        textStyles={{ color: colors.secondary[600] }}
                                        title='Cancel request'
                                        onPress={() => { onCancelRequest() }}
                                    />
                                </View>
                            )
                        }

                    </>)
            }

        </ScrollView>
    )
}

export default AcceptedRideContent

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 24,
        paddingHorizontal: 24,
        justifyContent: "space-between"
    },
    dot: {
        backgroundColor: colors.secondary[400],
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10
    },
    vehicleDetailContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.primary[100],
        paddingHorizontal: 16,
        marginTop: 20,
        paddingVertical: 10
    },
    vehicleColumnContainer: {
        flexDirection: "column",
    },
    riderDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: 16
    },
    imageContainer: { width: 60, height: 60, overflow: "hidden", borderRadius: 30, marginRight: 10, backgroundColor: colors.primary[400], },
    ratingContainer: { flexDirection: "row", alignItems: "center", marginRight: 10 },
    separationLine: { marginRight: 10, width: 2, height: 10, backgroundColor: "#ccc" },
    contactContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center"
    },
    chatContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
        flexGrow: 1,
        marginRight: 10,
        padding: 10,
        borderColor: "#eee",
        borderWidth: 1,
        shadowColor: "#ccc",
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        borderRadius: 10
    },
    callContainer: {
        backgroundColor: "#fff",
        borderColor: "#eee",
        borderWidth: 1,
        shadowColor: "#ccc",
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        borderRadius: 10,
        padding: 10,

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        color: '#333',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    star: {
        marginHorizontal: 5,
    },
    reviewInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    submitButton: {
        width: '100%',
        backgroundColor: colors.primary[500],
    },
    skipButton: {
        marginTop: 10,
        padding: 10,
    },
    skipButtonText: {
        color: colors.primary[500],
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: "rgba(0,0,0,0.5)"
    },

    userAvatar: { width: 45, height: 45, borderRadius: 40, }
    ,
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})