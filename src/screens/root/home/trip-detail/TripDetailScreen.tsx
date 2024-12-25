

import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { TripDetailScreenProps } from '../../../../types/types'
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView } from 'react-native';
import colors from '../../../../utils/data/colors';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AxiosInstance } from '../../../../config/AxiosInstance';
import BottomModal from '../../../../components/profile/BottomModal';
import BottomModalWithOverlay from '../../../../components/profile/ModalWithOverlay';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { TextInput } from 'react-native';
import StyledButton from '../../../../styled/StyledButton';
import { setDestinationLocation, setUserLocation } from '../../../../state/location/locationSlice';
import { setVehicleType } from '../../../../state/rideRequest/rideRequestSlice';

const TripDetailScreen = ({ route, navigation }: TripDetailScreenProps) => {
    const { item } = route.params;

    const Accepted = () => {
        return <View style={{ backgroundColor: colors.primary[200], width: 100, padding: 10, flexDirection: "row", alignItems: "center", borderRadius: 10, gap: 5, marginBottom: 10, marginHorizontal: 16 }}>
            <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: colors.primary[600] }}></View>
            <Text style={{ color: colors.primary[600] }}>{item?.status}</Text>
        </View>
    }

    const Canceled = () => {
        return <View style={{ backgroundColor: colors.secondary[200], width: 100, padding: 10, flexDirection: "row", alignItems: "center", borderRadius: 10, gap: 5, marginBottom: 10, marginHorizontal: 16 }}>
            <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: colors.secondary[600] }}></View>
            <Text style={{ color: colors.secondary[600] }}>{item?.status}</Text>
        </View>
    }

    const [deleting, setDeleting] = useState(false);
    const deleteRide = async () => {
        try {
            setDeleting(true)
            const data = await AxiosInstance.delete(`/ride/${item.rideId}`);
            navigation.pop(1);

        } catch (error: any) {
            console.log(error.message)
        }
        finally {
            setDeleting(false);
        }
    }

    const [showRatingModal, setShowRatingModal] = useState(false);
    const {user}=useSelector((state:RootState)=>state.user)
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
 
    const handleRatingSubmit = async () => {
     try {
         setSubmitting(true);
      
       let reviewedDriverId=item?.driver?.id;
       let reviewerUserId=user?.id
      
         // Submit rating to your backend
         await AxiosInstance.post('/review', {
             rating,
             review,
             reviewerUserId,
             reviewedDriverId
         });
         setShowRatingModal(false);
    
         navigation.pop(1)
     } catch (error) {
         console.log('Error submitting rating:', error);
     } finally {
         setSubmitting(false);
     }
 };

 const dispatch=useDispatch()
 const onRepeatRequest=()=>{
    dispatch(setUserLocation(item?.pickup));
    dispatch(setDestinationLocation(item?.dropoff));
    dispatch(setVehicleType(item?.vehicleType));
    navigation.navigate("FindDestinationScreen")
 }

  const onCallPress = () => {
         Linking.openURL(`tel:${item?.driver?.mobileNumber}`)
     }
    return (
        <View style={{ flex: 1 }}>
           <Pressable 
  
           style={{flex:1}}>
           <SafeAreaView style={{ flexDirection: "row", justifyContent: "center", backgroundColor: "#fff", borderBottomColor: "#eee", borderBottomWidth: 4, paddingHorizontal: 16, paddingTop: 10 }}>
                <Pressable style={{ position: "absolute", top: 60, left: 16 }} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontWeight: "600", fontSize: 18, textAlign: "center" }}>
                        Trip Detail
                    </Text>
                </View>
            </SafeAreaView>

            <ScrollView style={{ backgroundColor: "#fff" }}>
                {/* Vehicle and Price Info */}
                <View style={{
                    flexDirection: "column", gap: 10, borderBottomColor: "#ddd",
                    borderBottomWidth: 1
                }}>
                    <View style={styles.vehicleInfoContainer}>
                        <View style={styles.vehicleTypeContainer}>
                            <View style={styles.iconContainer}>
                                {
                                    item?.vehicleType == "Car" ? (
                                        <FontAwesome5 name="car" size={20} color="#555" />
                                    ) : (
                                        <MaterialCommunityIcons name="motorbike" size={20} color="#555" />
                                    )
                                }
                            </View>
                            <View>
                                <Text style={styles.vehicleType}>{item?.vehicleType || "Standard"}</Text>
                                <Text style={styles.licensePlate}>{item?.driver?.vehicleRegistrationNumber || "ABC 123"}</Text>
                            </View>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceLabel}>Total Fare</Text>
                            <Text style={styles.priceAmount}>Rs. {item?.offeredPrice || "25.00"}</Text>
                        </View>
                    </View>
                    {/* status */}
                    {
                        item?.status == 'canceled' ? <Canceled /> : <Accepted />
                    }

                </View>

                {/* loc */}
                <View style={{ backgroundColor: "#fff", padding: 16, flexDirection: "column", gap: 20, borderBottomColor: "#ddd", borderBottomWidth: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <View style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: colors.secondary[200], flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <AntDesign name="arrowdown" size={20} color="#fff" />
                        </View>
                        <Text>{item?.pickup?.userAddress}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <View style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: colors.primary[200], flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Entypo name="location-pin" size={20} color="#fff" />
                            </View>
                            <Text>{item?.dropoff?.destinationAddress}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 80 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <AntDesign name="clockcircleo" size={24} color="#555" />
                            <Text>19 min</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <MaterialCommunityIcons name="map-marker-distance" size={24} color="#555" />
                            <Text>19 km</Text>
                        </View>
                    </View>
                </View>

                {/* Rest of the existing code remains the same */}
                {/* rider details */}
                <View style={{ flexDirection: "column", gap: 20, borderBottomColor: "#ddd", borderBottomWidth: 1 }}>
                    <View style={styles.riderDetails}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={styles.imageContainer}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", borderRadius: 100 }}>
                                    <Text style={{ color: "#fff", fontSize: 30 }}>{item?.driver?.fullName?.slice(0, 1)}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "column" }}>
                                <Text>
                                    {item?.driver?.fullName}
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
                        <Pressable 
                        onPress={onCallPress}
                        style={{ backgroundColor: colors.secondary[200], padding: 8, borderRadius: 20 }}>
                            <Ionicons name="call" size={24} color="#fff" />
                        </Pressable>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 80, marginBottom: 10 }}>
                        <Pressable 
                        onPress={()=>setShowRatingModal(true)}
                        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <MaterialIcons name="star-rate" size={24} color={colors.secondary[400]} />
                            <Text>Rate now</Text>
                        </Pressable>
                        <Pressable 
                        onPress={onRepeatRequest}
                        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <FontAwesome name="repeat" size={20} color={colors.secondary[400]} />
                            <Text>Repeat request</Text>
                        </Pressable>
                    </View>
                </View>
                {/* delete */}
                <TouchableOpacity
                    onPress={deleteRide}
                    style={{ padding: 10, borderRadius: 10, backgroundColor: "#eee", marginTop: 20, marginHorizontal: 16 }}>
                    <Text style={{ color: "#555", textAlign: "center" }}>Delete history {deleting && (<ActivityIndicator size={16}></ActivityIndicator>)}</Text>
                </TouchableOpacity>
            </ScrollView>
           </Pressable>
           <BottomModalWithOverlay initialHeight={1} modalVisible={showRatingModal}>
            <View style={styles.ratingModalContent}>
                  

                    {/* Title */}
                    <Text style={styles.modalTitle}>Rate your ride</Text>
                    
                    {/* Star Rating */}
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Pressable
                                key={star}
                                onPress={() => setRating(star)}
                            >
                                <FontAwesome
                                    name={rating >= star ? "star" : "star-o"}
                                    size={32}
                                    color={colors.secondary[400]}
                                    style={styles.star}
                                />
                            </Pressable>
                        ))}
                    </View>

                    {/* Review Input */}
                    <TextInput
                        style={styles.reviewInput}
                        placeholder="Write your review (optional)"
                        multiline
                        numberOfLines={4}
                        value={review}
                        onChangeText={setReview}
                        placeholderTextColor="#999"
                    />

                    {/* Submit Button */}
                    <StyledButton
                        title={submitting ? "Submitting..." : "Submit Rating"}
                        onPress={handleRatingSubmit}
                        disabled={rating === 0 || submitting}
                        buttonStyles={styles.submitButton}
                        textStyles={{color:"#fff"}}
                    />

                    {/* Skip Button */}
                    <Pressable
                        onPress={() => {
                           
                            setShowRatingModal(false);
                            navigation.pop(1);
                        }}
                        style={styles.skipButton}
                    >
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </Pressable>
                </View>
            </BottomModalWithOverlay>
        </View>
    )
}

export default TripDetailScreen

const styles = StyleSheet.create({
    // Existing styles
    riderDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: 16,
        justifyContent: "space-between"
    },
    imageContainer: {
        width: 60,
        height: 60,
        overflow: "hidden",
        borderRadius: 30,
        marginRight: 10,
        backgroundColor: colors.primary[400],
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10
    },
    separationLine: {
        marginRight: 10,
        width: 2,
        height: 10,
        backgroundColor: "#ccc"
    },
    // New styles for vehicle and price info
    vehicleInfoContainer: {
        backgroundColor: "#fff",
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",


    },
    vehicleTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.secondary[100],
        justifyContent: "center",
        alignItems: "center"
    },
    vehicleType: {
        fontSize: 16,
        fontWeight: "600"
    },
    licensePlate: {
        color: "#888",
        marginTop: 2
    },
    priceContainer: {
        alignItems: "flex-end"
    },
    priceLabel: {
        color: "#888",
        fontSize: 12
    },
    priceAmount: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.secondary[400]
    },
    ratingModalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        width: '100%',
        alignItems: 'center',
        position: 'relative',
        paddingTop: 60
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 40,
        padding: 8,
        zIndex: 1
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
        color: '#333',
        textAlign: 'center'
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    star: {
        marginHorizontal: 8,
    },
    reviewInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        textAlignVertical: 'top',
        minHeight: 120,
        fontSize: 16,
        color: '#333'
    },
    submitButton: {
        width: '100%',
        backgroundColor: colors.primary[500],
        marginBottom: 12
    },
    skipButton: {
        padding: 12,
    },
    skipButtonText: {
        color: colors.primary[500],
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500'
    },
})