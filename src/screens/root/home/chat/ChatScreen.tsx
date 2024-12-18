import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useHeaderHeight } from '@react-navigation/elements';
import colors from '../../../../utils/data/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { addDoc, collection, doc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { database } from '../../../../../firebaseConfig';
import { Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

const ChatScreen = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([])
    const headerHeight = useHeaderHeight();
    const { ongoingRide } = useSelector((state: RootState) => state.ongoingRide)

    const onCallPress = () => {
        Linking.openURL(`tel:${ongoingRide?.driver?.mobileNumber}`)
    }

    //fetch messages
    useEffect(() => {
        const docRef = doc(database, "chats", ongoingRide?.rideId);
        const messageRef = collection(docRef, "messages");
        const q = query(messageRef, orderBy("createdAt", "asc"));
        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data()
            })
            setMessages([...allMessages]);
        })
        return unsub;
    }, [])


    const { user } = useSelector((state: RootState) => state.user)
    const sendMessage = async () => {
        if (!message) {
            return;
        }
        try {
            let rideId = ongoingRide?.rideId;
            const docRef = doc(database, "chats", rideId);
            const messageRef = collection(docRef, "messages");

            const newDoc = await addDoc(messageRef, {
                userId: user?.id,
                name: user?.fullName,
                text: message,
                createdAt: Timestamp.fromDate(new Date()),
                sentBy: "user"
            })
            console.log("new msg is", newDoc.id)
        } catch (error: any) {
            Alert.alert("error:", error.message)
        }
    }
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        //   keyboardVerticalOffset={headerHeight + 64}
        >
            {/* header */}
            <SafeAreaView style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", borderBottomColor: "#eee", borderBottomWidth: 4, paddingHorizontal: 16, paddingTop: 10 }}>
                <Pressable>
                    <AntDesign name="arrowleft" size={24} color="#555" />
                </Pressable>
                <View>
                    <Text style={{fontWeight:"600",fontSize:18}}>
                        {ongoingRide?.driver?.fullName}
                    </Text>
                </View>
                <Pressable onPress={onCallPress}>
                <Ionicons name="call" size={24} color={colors.primary[600]} />
                </Pressable>
            </SafeAreaView>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Chat messages would go here */}
                {
                    messages.map((item) => {
                        if (item.sentBy == "user") {
                            return (<>
                                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10, }}>
                                    <View style={{ padding: 10, backgroundColor: colors.primary[400], maxWidth: "60%", borderBottomLeftRadius: 10, borderTopRightRadius: 10 }}>
                                        <Text style={{ flexWrap: "wrap", color: "#fff" }}>{item?.text}</Text>
                                    </View>
                                </View>
                            </>)
                        } else {
                            return (<>
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10, }}>
                                    <View style={{ padding: 10, backgroundColor: "#fff", maxWidth: "60%", borderBottomRightRadius: 10, borderTopLeftRadius: 10 }}>
                                        <Text style={{ flexWrap: "wrap", color: colors.primary[700] }}>{item?.text}</Text>
                                    </View>
                                </View>
                            </>)
                        }
                    })
                }
            </ScrollView>

            <View style={styles.inputContainer}>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Type a message'
                        value={message}
                        onChangeText={setMessage}
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>

                <Pressable onPress={sendMessage} style={styles.microphoneButton}>
                    <FontAwesome name="microphone" size={20} color="white" />
                </Pressable >
            </View>
        </KeyboardAvoidingView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        marginTop: 10
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    textInputWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        backgroundColor: "#fff",
        padding: 10,
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 5,
        maxHeight: 100, // Limit maximum height
    },
    microphoneButton: {
        backgroundColor: colors.secondary[300],
        padding: 6,
        marginTop: 20,
        borderRadius: 20,
    },
});

export default ChatScreen;
