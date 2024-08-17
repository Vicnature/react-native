/** @format */

import React, { useState, useContext } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserContext } from "../../../app/_layout"; // Import the UserContext
import { useNavigation } from "expo-router";
import { COLORS } from "../../../constants";
const MenuModal = ({ visible, onClose }) => {
	const navigate = useNavigation();
	const { signOut } = useContext(UserContext);
	const handleMenuOptionClick = (option) => {
		onClose();
		if (option === "home") navigate.navigate("index");
		if (option === "myProfile") navigate.navigate("profile/display");
		if (option === "signOut") signOut();
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
					<View style={styles.Header}>
						<Text style={styles.HeaderText}>JOB FINDERS APPLICATION</Text>
						<Text style={styles.FormInstructions}>
							Choose where you want to go
						</Text>
					</View>
					<TouchableOpacity
						style={styles.optionButton}
						onPress={() => handleMenuOptionClick("home")}
					>
						<Text style={styles.optionText}>HOME PAGE</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.optionButton}
						onPress={() => handleMenuOptionClick("myProfile")}
					>
						<Text style={styles.optionText}>YOUR PROFILE</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.optionButton}
						onPress={() => handleMenuOptionClick("signOut")}
					>
						<Text style={styles.optionText}>SIGN OUT</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.optionButton} onPress={onClose}>
						<Text style={styles.optionText}>CANCEL</Text>
					</TouchableOpacity>
				</View>
					<View style={styles.Footer}>
						<Text>MOBILE APP DEVELOPMENT. GROUP 5.</Text>
					</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
        // bottom:0,
        // left:0,
        // position:"absolute",
        height:"70%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.white,
	},

	modalContent: {
        backgroundColor: COLORS.white,
		width: "100%",
		flex: 1,
		// backgroundColor: "white",
		paddingVertical: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	optionButton: {
		paddingVertical: 15,
		// borderBottomColor: "#ddd",
		// borderBottomWidth: 1,
        backgroundColor: COLORS.tertiary,
        marginVertical: 10,
        width:"90%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        // shadowColor: "#000",
        shadowColor:COLORS.black,
        shadowOffset: { width: 10, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 20,
	},
	optionText: {
		fontSize: 25,
		textAlign: "center",
		fontWeight: "bold",
		color: COLORS.lightWhite,
	},
	Header: {
		// padding: 10,
		fontWeight: "bold",
		fontStyle: "italic",
		width: "100%",
		marginBottom: 50,
		// height:"10%",
		// justifyContent: "center",
		alignItems: "center",
	},
	HeaderText: {
		fontSize: 25,
		fontWeight: "bold",
		color: COLORS.tertiary,
	},
	FormInstructions: {
		// width:"80%",
		color: "gray",
	},
	Footer: {
		position: "absolute",
		bottom: "1%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 1,
	},
});

export default MenuModal;
