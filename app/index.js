/** @format */
import { View, ScrollView, SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Nearbyjobs, Popularjobs, Welcome } from "../components";
import { COLORS, SIZES } from "../constants";
import React, { useState, useEffect, useCallback } from "react";
import { ListOfAllCountries } from "../hook/useFetch";
import { cacheLocationData } from "../utils/cache";
import GetUserCountry from "./sensors";

import { connectToDatabase, getProfile } from "../utils/sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Home = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const navigation = useNavigation();
	const [user, setUser] = useState({});

	useEffect(() => {
		retrieveListOfCountires();
		authenticate();
		userProfile();
	}, []);

	useFocusEffect(
		useCallback(() => {
			authenticate();
		}, []),
	);
	const authenticate = async () => {
		// navigation.navigate("form");
		try {
			console.log("checking for user session");
			const userSession = await AsyncStorage.getItem("userSession");
			if (userSession !== null) {
				// Session exists, user is signed in
				const user = JSON.parse(userSession);
				console.log("User session found: ", user);
				setUser(user);
			} else {
				navigation.navigate("form");
				console.log("No user session found!redirecting to authentication page");
				alert(
					"Kindly Sign up a new account or Sign in with an existing one to continue.",
				);
			}
		} catch (error) {
			console.error("Error retrieving session: ", error);
		}
	};

	const retrieveListOfCountires = async () => {
		try {
			const countries = await ListOfAllCountries();
			await cacheLocationData("locationData", countries);
			const userCountry = await GetUserCountry();
			await cacheLocationData("userCountry", userCountry);
		} catch (error) {
			console.error("Error when caching the location:", error);
		}
	};

	const userProfile = async () => {
		// const db = await connectToDatabase();
		// const user = await getProfile(db);
		// setUser("none");
		// console.log("User successfully fetched from the database:",user[0]);
		// if (user) setUser(user[0]);
		// console.log(user[0])
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ flex: 1, padding: SIZES.medium }}>
					<Welcome
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						user={user}
						handleClick={() => {
							if (searchTerm) {
								router.push(`/search/${searchTerm}`);
							}
						}}
					/>
					<Popularjobs />
					<Nearbyjobs />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;
