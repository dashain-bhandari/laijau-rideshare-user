import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    RegisterScreen: undefined;
    EnterDetailsScreen: {
        mobileNumber: string
    },
    TabsScreen: undefined,
    OtpVerificationScreen: { email: string },
    OnboardingScreen: undefined,
    HomeScreen: undefined,
    FindRideScreen: undefined,
    FindDestinationScreen: undefined,
    FilterRideScreen: undefined,
    UserProfileScreen: undefined,
    SetOnMapScreen: undefined,
    AllAddressScreen: undefined,
    AddNewAddressScreen: {
        tag:string,
        selectedIcon:string
    },
    SetAnyAddressScreen: {
        tag:string,
        selectedIcon:string
    },
    SaveNewAddressScreen: {
        tag: string,
        address: {
            latitude: number,
            longitude: number,
            addressName: string
        },
        selectedIcon: string

    }
}
export type EnterDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'EnterDetailsScreen'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'RegisterScreen'>;
export type TabsScreenProps = NativeStackScreenProps<RootStackParamList, 'TabsScreen'>;
export type OtpVerificationScreenProps = NativeStackScreenProps<RootStackParamList, 'OtpVerificationScreen'>;



export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;
export type FindRideScreenProps = NativeStackScreenProps<RootStackParamList, 'FindRideScreen'>;
export type FindDestinationScreenProps = NativeStackScreenProps<RootStackParamList, 'FindDestinationScreen'>;
export type FilterRideScreenProps = NativeStackScreenProps<RootStackParamList, 'FilterRideScreen'>;
export type UserProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'UserProfileScreen'>;
export type AllAddressScreenProps = NativeStackScreenProps<RootStackParamList, 'AllAddressScreen'>;
export type AddNewAddressScreenProps = NativeStackScreenProps<RootStackParamList, 'AddNewAddressScreen'>;
export type SetAnyAddressScreenProps = NativeStackScreenProps<RootStackParamList, 'SetAnyAddressScreen'>;
export type SaveNewAddressScreenProps = NativeStackScreenProps<RootStackParamList, 'SaveNewAddressScreen'>;


export interface SetOnMapProps extends SetOnMapScreenProps {
    tag: "destination" | "pickup"
    buttonTitle: string,
    confirmHandler: () => void,

}
export type SetOnMapScreenProps = NativeStackScreenProps<RootStackParamList, 'SetOnMapScreen'>

export type HomeScreenNavigation = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
export type FindDestinationNavigation = NativeStackNavigationProp<RootStackParamList, 'FindDestinationScreen'>;