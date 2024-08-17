/** @format */

import React, { useState, useContext } from "react";
import {
	View,
	Text,
	TextInput,
	Modal,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { COLORS } from "../../constants";
import { UserContext } from "../_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Firestore } from "../../utils/db";
import { writeUserData } from "../../utils/db";
import { useNavigation } from "expo-router";

const CustomModal = ({
	visible,
	onClose,
	clickedValue,
	setIsLoading,
	clickedLabel,
	setNewUser,
}) => {
	const [inputValue, setInputValue] = useState("");
	const { user } = useContext(UserContext);
	const navigation = useNavigation();
	// const handleSubmit = () => {
	//     try{
	//         if (user && user.name) {
	//             setIsLoading(true);
	//         } else {
	//             console.log("User is not defined or user name is not available");
	//         }
	//         setInputValue("");
	//         onClose();
	//     }catch(e){
	//         console.error("Error occurred while saving profile: ", e);
	//         setIsLoading(false);
	//         alert("Failed to save profile. Please try again later.");
	//     }
	// };

	const handleCancel = () => {
		setInputValue("");
		onClose();
	};

	const editProfile = async () => {
		try {
			setIsLoading(true);
			onClose();

			if (user && user.name) {
				// Clone the user object to avoid mutating the original
				const updatedUser = { ...user };

				// Update the value corresponding to the clicked label
				updatedUser[clickedLabel] = inputValue;

				// Save the updated user information to AsyncStorage
				await AsyncStorage.setItem("userSession", JSON.stringify(updatedUser));
				// Optionally update the value in Firestore or other databases
				await Firestore(updatedUser);
				await writeUserData(updatedUser);
				setNewUser(updatedUser);
				// Navigate back to the display screen or perform other necessary actions
				// navigation.navigate("display");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal transparent={true} visible={visible} onRequestClose={handleCancel}>
			<View style={styles.modalBackground}>
				<View style={styles.modalContainer}>
					<Text style={styles.modalTitle}>
						Provide new {clickedLabel}
					</Text>
					<TextInput
						style={styles.input}
						placeholder="Type here..."
						value={inputValue}
						onChangeText={setInputValue}
					/>
					<View style={styles.buttonContainer}>
						<TouchableOpacity onPress={editProfile} style={styles.button}>
							<Text style={styles.buttonText}>Submit</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleCancel} style={styles.button}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContainer: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 10,
		width: "85%",
		// alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		marginVertical: 20,
		fontWeight:"semi-bold",
	},
	input: {
		height: 60,
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 20,
		paddingHorizontal: 10,
		width: "100%",
		fontSize:20,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	button: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: COLORS.tertiary,
		// marginHorizontal: 5,
		justifyContent: "center",
		alignItems: "center",
		width: "48%",
	},
	buttonText: {
		color: "white",
		fontSize: 16,
	},
});

export default CustomModal;
