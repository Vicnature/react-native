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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Home = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const navigation = useNavigation();
	const [user, setUser] = useState({});
	const [profession, setProfession] = useState("");
	const [preferredJob, setPreferredJob] = useState("");
	useEffect(() => {
		authenticate();
		retrieveListOfCountires();
		// userProfile();
	}, []);

	useFocusEffect(
		useCallback(() => {
			authenticate();
		}, []),
	);
	const authenticate = async () => {
		try {
			console.log("checking for user session");
			const userSession = await AsyncStorage.getItem("userSession");
			if (userSession !== null) {
				// Session exists, user is signed in
				const user = JSON.parse(userSession);
				console.log("User session found: ", user);
				if (user) setUser(user);
				if (user) setProfession(user?.profession);
				if (user) setPreferredJob(user?.job_preference);
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

	const refreshData = async () => {
		try{
if(user && user!==null){
	
}
		}catch(e){

		}
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
					<Popularjobs query="7 figure salary" user={user}/>
					<Nearbyjobs  query={profession} job_preference={preferredJob} user={user}/>
					{/* <Nearbyjobs /> */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;
