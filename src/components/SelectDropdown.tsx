import { Modal, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { TouchableOpacity } from 'react-native';

interface SelectDropDownProps {
    listOptions: string[],
    display: "flex" | "none",
    dropdownContainerStyle?: StyleProp<ViewStyle>,
    dropdownItemStyle?: StyleProp<ViewStyle>,
    selectedItem?: string,
    onSelect: (item: string) => void,
    selectedItemColor?: string
    setDisplay: Dispatch<SetStateAction<"flex" | "none">>,
}

const SelectDropdown = ({ listOptions, display, dropdownContainerStyle, dropdownItemStyle, onSelect, selectedItem, selectedItemColor, setDisplay }: SelectDropDownProps) => {

    if (display != "flex") {
        return null;
    }
    return (
        <View style={[styles.dropdownContainer, dropdownContainerStyle]}>
            {listOptions.map((item: string, index: number) => {
                return (<TouchableOpacity key={index}
                    style={[styles.dropdownItem, dropdownItemStyle, { backgroundColor: item == selectedItem ? selectedItemColor ?? "#eee" : "#fff" }]}
                    onPress={() => {
                        onSelect(item);
                        setDisplay("none")
                    }}
                ><Text>{item}</Text></TouchableOpacity>)
            })}
        </View>

    )
}

export default SelectDropdown

const styles = StyleSheet.create({
    dropdownContainer: {

        shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowRadius: 2,
        shadowOpacity: 0.3,

        position: "absolute",
        zIndex: 10,
        top: 40,
        left: 0,
        right: 0,



    },
    dropdownItem: {
        paddingVertical: 10,
        paddingLeft: 10,
        width: "100%",


    }
})