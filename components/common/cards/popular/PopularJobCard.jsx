/** @format */

import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./popularjobcard.style";
import { checkImageURL } from "../../../../utils";  //utility function for checking  availability of company logo.Shows a default image if its absent

const PopularJobCard = ({ item, selectedJob, handleCardPress }) => {
	return (
		<TouchableOpacity
			style={styles.container(selectedJob, item)}
			onPress={() => handleCardPress(item)}
		>
			<TouchableOpacity style={styles.logoContainer(selectedJob, item)}>
				{/* employer's logo */}
				<Image
					source={{
					  uri: checkImageURL(item?.employer_logo)
					    ? item.employer_logo
					    : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
					}}
					resizeMode="contain"
					style={styles.logoImage}
				/>

				{/* employer's name */}
			</TouchableOpacity>
			<Text style={styles.companyName} numberOfLines={1}>
				{item.employer_name}
			</Text>

			{/* job title */}
			<View style={styles.infoContainer}>
				<Text style={styles.jobName(selectedJob, item)} numberOfLines={1}>
					{item.job_title}
				</Text>

				{/* job publisher */}
				<View style={styles.infoWrapper}>
					<Text style={styles.publisher(selectedJob, item)}>
						{item?.job_publisher} -
					</Text>

					{/* job location(country/state) */}
					<Text style={styles.location}> {item.job_country}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default PopularJobCard;
