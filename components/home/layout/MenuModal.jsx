import React, { useState, useContext } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserContext } from "../../../app/_layout"; // Import the UserContext
import { useNavigation } from "expo-router";
const MenuModal = ({ visible, onClose }) => {
    const navigate=useNavigation();
    const { signOut } = useContext(UserContext);
    const handleMenuOptionClick = (option) => {
        onClose();
        if (option === "home") navigate.navigate("index")
        if (option === "myProfile") navigate.navigate("profile/display")
        if (option === "signOut") signOut()
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => handleMenuOptionClick("home")}
                    >
                        <Text style={styles.optionText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => handleMenuOptionClick("myProfile")}
                    >
                        <Text style={styles.optionText}>My Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => handleMenuOptionClick("signOut")}
                    >
                        <Text style={styles.optionText}>Sign Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={onClose}>
                        <Text style={styles.optionText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "100%",
        flex:1,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    optionButton: {
        paddingVertical: 15,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: 18,
        textAlign: "center",
        color: "black",
    },
});

export default MenuModal;
