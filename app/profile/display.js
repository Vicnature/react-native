/** @format */

/** @format */
/** @format */

import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../_layout";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { useNavigation } from "expo-router";
import CustomModal from "./modal"; // Import the Modal component
import * as SecureStore from "expo-secure-store";

const customLabels = {
	JOB_PREFERENCE: "Job Preference",
	RESUME_LINK: "Resume Link",
};

const Display = () => {
	const [loading, setIsLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [clickedValue, setClickedValue] = useState("");
	const [clickedLabel, setClickedLabel] = useState("");
	const [newUser, setNewUser] = useState(null);
	const navigation = useNavigation();
	const { user, authenticate, deleteUser } = useContext(UserContext);

	useEffect(() => {
		setIsLoading(true);
		authenticate();
		if (user && user.name) {
			setIsLoading(false);
		} else {
			console.log("User is not defined or user name is not available");
		}
	}, [newUser]);

	return (
		<ScrollView contentContainerStyle={styles.scrollWrapper}>
			<View style={styles.innerContainer}>
				{loading && <ActivityIndicator size="large" color={COLORS.tertiary} />}
				<Text style={styles.formMessage}>{message}</Text>
				<View style={styles.Header}>
					<Text style={styles.HeaderText}>USER PROFILE PAGE</Text>
					{/* <Text style={styles.FormInstructions}>View and Edit your profile.</Text> */}
				</View>

				{Object.entries(user).map(([key, value]) => {
					const label =
						customLabels[key] || key.replace(/_/g, " ").toUpperCase();
					return (
						<View style={styles.profileItem} key={key}>
							<View style={styles.profileDetails}>
								<Text style={styles.heading}>{label}</Text>
								<Text style={styles.information}>
									{value || "Not Available"}
								</Text>
							</View>
							<TouchableOpacity
								onPress={() => {
									setModalVisible(true);
									setClickedValue(value);
									setClickedLabel(key);
								}}
							>
								<Image
									source={require("../../assets/icons/left.png")}
									style={styles.arrow_icon}
								/>
								<Text style={{ color: COLORS.tertiary, fontWeight: "bold" }}>
									Edit
								</Text>
							</TouchableOpacity>
						</View>
					);
				})}

				<View style={styles.subHeading}>
					<Text
						style={styles.subHeadingInfo}
						onPress={async () => {
							navigation.navigate("profile/index");
							await SecureStore.setItemAsync("lastOpenedScreen", "profile/index")
						}}
					>
						EDIT EVERYTHING
					</Text>
				</View>

				{/* Modal */}
				<CustomModal
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
					clickedValue={clickedValue}
					clickedLabel={clickedLabel}
					setIsLoading={setIsLoading}
					setNewUser={setNewUser}
				/>
			</View>
		</ScrollView>
	);
};

export default Display;

const styles = StyleSheet.create({
	scrollWrapper: {
		backgroundColor: "white",
		padding: "5%",
		justifyContent: "center",
	},
	innerContainer: {
		padding: 10,
		borderRadius: 10,
		width: "100%",
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: { width: 10, height: 0 },
		shadowOpacity: 0.1,
		shadowRadius: 30,
		elevation: 20,
	},
	imageBox: {
		backgroundColor: COLORS.secondary,
		marginBottom: 10,
	},
	profile_image: {},
	profileItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
		paddingHorizontal: 10,
		borderRadius: 5,
		width: "100%",
		paddingVertical: 10,
		borderBottomColor: COLORS.secondary,
		borderBottomWidth: 0.3,
		flexWrap: "wrap",
	},
	profileDetails: {
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingHorizontal: 10,
	},
	heading: {
		fontSize: SIZES.large,
		fontWeight: "bold",
		marginBottom: 10,
	},
	information: {
		fontSize: SIZES.medium,
		marginBottom: 5,
		letterSpacing: 1.2,
	},
	arrow_icon: {
		width: 30,
		height: 30,
		transform: [{ rotate: "180deg" }],
	},
	button: {
		backgroundColor: "blue",
		padding: 10,
		margin: 10,
	},
	text: {
		color: "white",
		fontSize: 20,
	},
	formMessage: {
		fontSize: SIZES.small,
		color: "black",
		fontWeight: "bold",
	},
	Header: {
		padding: 20,
		fontWeight: "bold",
		fontStyle: "italic",
		borderRadius: 10,
		width: "100%",
		marginBottom: 20,
		// justifyContent: "center",
		// alignItems: "center",
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		// height:100,
		backgroundColor: COLORS.tertiary,
	},
	HeaderText: {
		fontSize: 25,
		fontWeight: "bold",
		color: "white",
		visible: "false",
	},
	FormInstructions: {
		color: "gray",
		fontSize: 20,
	},

	subHeading: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
		borderRadius: 10,
		marginVertical: 20,
		width: "100%",
		fontSize: 20,
	},
	subHeadingTitle: {
		color: "red",
		fontWeight: "bold",
	},
	subHeadingInfo: {
		color: COLORS.tertiary,
		fontWeight: "bold",
		fontSize: 20,
	},
});
