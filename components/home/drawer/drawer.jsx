/** @format */

import React from "react";
import {
	SafeAreaView,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	Text,
	StatusBar,
} from "react-native";
import { COLORS, icons, images, SIZES } from "../../../constants";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOutFromFirebase } from "../../../app/auth"
import { deleteFile } from "../../../utils/sqlite";
const DATA = [
	{
		id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
		title: "Home",
		url: "index",
	},
	{
		id: "bd7acb6a-c1b1-46c2-aed5-3ad53abb28ba",
		title: "My Profile",
		url: "profile",
	},
	// {
	// 	id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
	// 	title: "Favorite Jobs",
	// 	url: "favorites",
	// },
	{
		id: "58694a0f-3da1-471f-bd96-145571e29d72",
		title: "Sign Out",
		url: "form",
	},
];

const Item = ({ title, onPress }) => (
	<TouchableOpacity style={styles.item} onPress={onPress}>
		<Text style={styles.title}>{title}</Text>
	</TouchableOpacity>
);

const MenuOptions = ({handlePress}) => {
	const router = useRouter();
	const navigation = useNavigation();
	const pressedItem = async({url,title}) => {
		try{

			if (url) {
				navigation.navigate(url);
				handlePress()
			}
	
			if(title=="Sign Out"){
				// navigation.navigate("form");
				alert("You have signed out of the application.Kindly sign in to continue using our services.Thankyou")
				handlePress()
				signOutFromFirebase()
				AsyncStorage.removeItem('userSession');
				await deleteFile("fullDisintegratedJobDetails")
				await deleteFile("fullDisintegratedJobDetails_2")
				console.log("User signed out and session cleared!");
			}
		}catch(error)
		{
			console.log(error)
		}


	};
	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={DATA}
				renderItem={({ item }) => (
					<Item title={item.title} onPress={() => pressedItem(item)} />
				)}
				keyExtractor={(item) => item.id}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
		paddingHorizontal: 10,
		paddingVertical: 50,
	},
	item: {
		backgroundColor: COLORS.tertiary,
		padding: 5,
		marginVertical: 8,
		width: 300,
	},
	title: {
		color: COLORS.white,
		fontSize: SIZES.large,
		fontWeight: "bold",
	},
});

export default MenuOptions;
