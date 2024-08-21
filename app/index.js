/** @format */
import { View, ScrollView, SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Nearbyjobs, Popularjobs, Welcome } from "../components";
import { COLORS, SIZES } from "../constants";
import React, { useState, useEffect, useCallback,useContext } from "react";
import { ListOfAllCountries } from "../hook/useFetch";
import { cacheLocationData } from "../utils/cache";
import GetUserCountry from "../utils/sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getDocFromFirestoreDb } from "../utils/db";
import { UserContext } from "./_layout";
import { usePushNotifications } from "../utils/notifications";
const Index = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const navigation = useNavigation();
	const [profession, setProfession] = useState("");
	const [preferredJob, setPreferredJob] = useState("");
	const router = useRouter();
	let { authenticate,user } = useContext(UserContext);

	useEffect(() => {
		authenticate();
		retrieveListOfCountires();
	}, []);

	useFocusEffect(
		useCallback(() => {
			authenticate();
		}, []),
	);


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
					<Popularjobs query="high salary" user={user} />
					<Nearbyjobs
						query={profession}
						job_preference={preferredJob}
						user={user}
					/>
					{/* <Nearbyjobs /> */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Index;
