/** @format */

import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
	Nearbyjobs,
	Popularjobs,
	ScreenHeaderBtn,
	Welcome,
} from "../components";
import { COLORS, icons, images, SIZES } from "../constants";

const Home = () => {
	const router = useRouter();

	return (
		// navigation bar
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: COLORS.lightwhite },
					headerShadowVisible: false,
					headerLeft: () => (
						<ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />
					),
					headerRight: () => (
						<ScreenHeaderBtn iconUrl={images.profile} dimension="100%" />
					),
					headerTitle: "",
				}}
			/>

			{/*scrollable component */}
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ flex: 1, padding: SIZES.medium }}>
					<Welcome />
					<Popularjobs />
					<Nearbyjobs />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;

// expo-cli start --tunnel
