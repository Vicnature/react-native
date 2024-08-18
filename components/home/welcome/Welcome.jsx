/** @format */

import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./welcome.style";
import { icons, SIZES } from "../../../constants";

// const jobTypes = ["Full-time", "Part-time", "Contractor"];

const Welcome = ({ searchTerm, setSearchTerm, handleClick, user }) => {
	const router = useRouter();
	const [activeJobType, setActiveJobType] = useState("Intern");
	const jobTypes = [ "Full Time","Part Time","Contractor", "Intern",];

	return (
		<View>
			{/* Greetings,name and introductory text */}
			<View style={styles.container}>
				<Text style={styles.userName}>{user && "Hello " + user.name}</Text>
				{/* {console.log("the user in this page is:", user)} */}
				{/* <Text style={styles.welcomeMessage}>
					We are so glad you're here...
				</Text> */}
				<Text style={styles.welcomeMessage}>
					Let's get you a good job.
				</Text>
			</View>

			{/* search input */}
			<View style={styles.searchContainer}>
				<View style={styles.searchWrapper}>
					<TextInput
						style={styles.searchInput}
						value={searchTerm}
						onChangeText={(text) => setSearchTerm(text)}
						placeholder="Search for any job(developer,engineer...)"
					/>
				</View>

				{/* search icon */}
				<TouchableOpacity style={styles.searchBtn} onPress={handleClick}>
					<Image
						source={icons.search}
						resizeMode="contain"
						style={styles.searchBtnImage}
					/>
				</TouchableOpacity>
			</View>

			{/* types of jobs.Full time,part time,contractor */}
			<View style={styles.tabsContainer}>
				<FlatList
					data={jobTypes}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.tab(activeJobType, item)}
							onPress={() => {
								setActiveJobType(item);
								router.push(`/search/${item}`);
							}}
						>
							<Text style={styles.tabText(activeJobType, item)}>{item}</Text>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item} //extracts the key to be used while iterating over the job types
					contentContainerStyle={{ rowGap: SIZES.small }} //creates a uniform gap between the job types
					// horizontal
				/>
			</View>
		</View>
	);
};

export default Welcome;
