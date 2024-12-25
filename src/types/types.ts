import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    SplashScreen: undefined,
    AuthStackScreen: undefined,
    AppStackScreen: undefined
}

export type AppStackParamList = {
    TabsScreen: undefined,

    HomeScreen: undefined,
    FindRideScreen: undefined,
    FindDestinationScreen: undefined,
    FilterRideScreen: undefined,
    UserProfileScreen: undefined,
    SetOnMapScreen: undefined,
    AllAddressScreen: undefined,
    ScheduleRideScreen: undefined,
    AddNewAddressScreen: {
        tag: string,
        selectedIcon: string,
        addressName?: string | undefined,
        addressLatitude?: number | undefined,
        addressLongitude?: number | undefined,
    },
    SetAnyAddressScreen: {
        tag: string,
        selectedIcon: string,
        addressName?: string | undefined,
        addressLatitude?: number | undefined,
        addressLongitude?: number | undefined,
    },
    SaveNewAddressScreen: {
        tag: string,
        address: {
            latitude: number,
            longitude: number,
            addressName: string
        },
        selectedIcon: string

    },
    FindScheduledRideScreen: {
        date: Date,
        alertDate: Date,
        selectedTime: string | null
    },
    AcceptedRideScreen: {
        tag:string
    },
    ChatScreen: {tag:string},
    BookForFriendScreen: undefined,
    AddDestinationScreen: undefined,
    AddStopScreen: {
        tag: string,
    },
    SetStopScreen: {
        tag: string
    },
    TripDetailScreen:{
        item:any
    }
}

export type AuthStackParamList = {
    RegisterScreen: undefined;
    EnterDetailsScreen: {
        mobileNumber: string
    },
    OtpVerificationScreen: { email: string },
    OnboardingScreen: undefined,
}

//auth stack
export type EnterDetailsScreenProps = NativeStackScreenProps<AuthStackParamList, 'EnterDetailsScreen'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'RegisterScreen'>;
export type OtpVerificationScreenProps = NativeStackScreenProps<AuthStackParamList, 'OtpVerificationScreen'>;


// app stack
export type TabsScreenProps = NativeStackScreenProps<AppStackParamList, 'TabsScreen'>;
export type HomeScreenProps = NativeStackScreenProps<AppStackParamList, 'HomeScreen'>;
export type FindRideScreenProps = NativeStackScreenProps<AppStackParamList, 'FindRideScreen'>;
export type FindDestinationScreenProps = NativeStackScreenProps<AppStackParamList, 'FindDestinationScreen'>;
export type FilterRideScreenProps = NativeStackScreenProps<AppStackParamList, 'FilterRideScreen'>;
export type UserProfileScreenProps = NativeStackScreenProps<AppStackParamList, 'UserProfileScreen'>;
export type AllAddressScreenProps = NativeStackScreenProps<AppStackParamList, 'AllAddressScreen'>;
export type AddNewAddressScreenProps = NativeStackScreenProps<AppStackParamList, 'AddNewAddressScreen'>;
export type SetAnyAddressScreenProps = NativeStackScreenProps<AppStackParamList, 'SetAnyAddressScreen'>;
export type SaveNewAddressScreenProps = NativeStackScreenProps<AppStackParamList, 'SaveNewAddressScreen'>;
export type ScheduleRideScreenProps = NativeStackScreenProps<AppStackParamList, 'ScheduleRideScreen'>;
export type FindScheduledRideScreenProps = NativeStackScreenProps<AppStackParamList, 'FindScheduledRideScreen'>;
export type SetOnMapScreenProps = NativeStackScreenProps<AppStackParamList, 'SetOnMapScreen'>;
export type AcceptedRideScreenProps = NativeStackScreenProps<AppStackParamList, 'AcceptedRideScreen'>;
export type ChatScreenProps = NativeStackScreenProps<AppStackParamList, 'ChatScreen'>;
export type BookForFriendScreenProps = NativeStackScreenProps<AppStackParamList, 'BookForFriendScreen'>;
export type AddDestinationScreenProps = NativeStackScreenProps<AppStackParamList, 'AddDestinationScreen'>;
export type SetStopScreenProps = NativeStackScreenProps<AppStackParamList, 'SetStopScreen'>;
export type AddStopScreenProps = NativeStackScreenProps<AppStackParamList, 'AddStopScreen'>;
export type TripDetailScreenProps = NativeStackScreenProps<AppStackParamList, 'TripDetailScreen'>;



export type HomeScreenNavigation = NativeStackNavigationProp<AppStackParamList, 'HomeScreen'>;
export type FindDestinationNavigation = NativeStackNavigationProp<AppStackParamList, 'FindDestinationScreen'>;

export interface SetOnMapProps extends SetOnMapScreenProps {
    tag: "destination" | "pickup"
    buttonTitle: string,
    confirmHandler: () => void,

}
