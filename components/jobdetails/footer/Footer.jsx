/** @format */

import { View, Text, TouchableOpacity, Image, Linking } from "react-native";

import styles from "./footer.style";
import { icons } from "../../../constants";

const Footer = ({ url }) => {
	return (
		<View style={styles.container}>
			{/* button for liking a job.Can be implemented using localStorage */}
			<TouchableOpacity style={styles.likeBtn}>
				<Image
					source={icons.heartOutline}
					resizeMode="contain"
					style={styles.likeBtnImage}
				/>
			</TouchableOpacity>

			{/* button used to apply for a given job */}
			<TouchableOpacity
				style={styles.applyBtn}
				onPress={() => Linking.openURL(url)}
			>
				<Text style={styles.applyBtnText}>Apply for this job</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Footer;
