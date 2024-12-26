import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'


import { GestureHandlerRootView, Pressable, TextInput } from 'react-native-gesture-handler'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ParamListBase, RouteProp, useNavigation } from '@react-navigation/native'
import AcceptedRideContent from './AcceptedRideContent'
import Map from '../../../../components/Map'
import CustomBottomSheet from '../../../../components/CustomBottomSheet'
import BackButton from '../../../../components/BackButton'
import { AcceptedRideScreenProps, HomeScreenNavigation } from '../../../../types/types'
import BottomModal from '../../../../components/BottomModal'
import StyledButton from '../../../../styled/StyledButton'
import colors from '../../../../utils/data/colors';
import BottomModalWithOverlay from '../../../../components/profile/ModalWithOverlay';
import { AxiosInstance } from '../../../../config/AxiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { setOngoingRide } from '../../../../state/ongoingRide/ongoingRideSlice';
import { setBookedRide } from '../../../../state/bookForFriend/bookForFriendSlice';
import { setScheduledRide } from '../../../../state/scheduledRide/scheduledRideSlice';

const AcceptedRide = ({navigation,route}:AcceptedRideScreenProps) => {
    const dispatch=useDispatch()
    const {tag}=route.params;
       const [showRatingModal, setShowRatingModal] = useState(false);
       const {user}=useSelector((state:RootState)=>state.user)
       const [rating, setRating] = useState(0);
       const [review, setReview] = useState('');
       const [submitting, setSubmitting] = useState(false);
       const {ongoingRide}=useSelector((state:RootState)=>state.ongoingRide)
       const {bookedForFriend}=useSelector((state:RootState)=>state.bookedForFriend)
       const {scheduledRide}=useSelector((state:RootState)=>state.scheduledRide)
       const handleRatingSubmit = async () => {
        try {
            setSubmitting(true);
         
            let reviewerUserId=user?.id;
            console.log("ongoing ride",ongoingRide)
            console.log("booked ride",bookedForFriend)
            console.log("scheduled ride",scheduledRide)
            let rideId=tag=="ongoingRide"?ongoingRide.rideId:tag=="bookedRide"?bookedForFriend?.rideId:scheduledRide?.rideId;
            let reviewedDriverId=tag=="ongoingRide"?ongoingRide?.driver?.id:tag=="bookedRide"?bookedForFriend?.driver?.id:scheduledRide?.driver?.id;
            console.log("reviewed driver id",reviewedDriverId)
            console.log("bookedride",bookedForFriend)

            tag=="ongoingRide" && dispatch(setOngoingRide(undefined));
            tag=="bookedRide" && dispatch(setBookedRide(undefined));
            tag=="scheduledRide" && dispatch(setScheduledRide(undefined));
            // Submit rating to your backend
            await AxiosInstance.post('/review', {
                rating,
                review,
                reviewerUserId,
                reviewedDriverId,
                rideId
            });
            setShowRatingModal(false);
       
            navigation.popTo("TabsScreen");
        } catch (error) {
            console.log('Error submitting rating:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
         style={{ flex: 1 }}
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <View style={styles.container}>
                <BackButton onPressHandler={()=>{
                    navigation.popToTop();
                }}/>
                <Map />
                <CustomBottomSheet scrollable={false} initialHeight={2.3}>
                    <AcceptedRideContent tag={tag} setShowRatingModal={setShowRatingModal} />
                </CustomBottomSheet>
             
            </View>
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
                            tag=="ongoingRide" && dispatch(setOngoingRide(undefined));
                           tag=="bookedRide" &&  dispatch(setBookedRide(undefined));
                            setShowRatingModal(false);
                            navigation.popTo("TabsScreen");
                        }}
                        style={styles.skipButton}
                    >
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </Pressable>
                </View>
            </BottomModalWithOverlay>
        </KeyboardAvoidingView>
        </GestureHandlerRootView>
    )
}

export default AcceptedRide

const styles = StyleSheet.create({
    container: {
        flex: 1
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