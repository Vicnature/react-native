/** @format */

import { View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect,useState } from "react";
import styles from "./nearbyjobcard.style";
import { checkImageURL } from "../../../../utils";
import { getDatabase, ref, onValue } from "firebase/database";

const NearbyJobCard = ({ job, handleNavigate }) => {
	const [views, setViews] = useState(0)
	useEffect(() => {
		const db = getDatabase();
		const jobRef = ref(db, `ViewedJobs/${job?.job_id}`);
		onValue(jobRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setViews(data.likeCount || 0);
				// setAppliedByCurrentUser(data.setAppliedByCurrentUser || false); // Update this based on your data structure
			}
		});
			// return () => unsubscribe();
	}, [job]);
	return (
		<TouchableOpacity style={styles.container} onPress={handleNavigate}>
			{/* employer's logo */}
			<TouchableOpacity style={styles.logoContainer}>
				<Image
					source={{
						uri: checkImageURL(job?.employer_logo)
							? job?.employer_logo
							: "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
					}}
					resizeMode="contain"
					style={styles.logoImage}
				/>
			</TouchableOpacity>

			{/* job title ->React Developer,Senior Software Engineer*/}
			<View style={styles.textContainer}>
				<Text style={styles.jobName} numberOfLines={1}>
					{job?.job_title}
				</Text>


				{/* type of job->fulltime,part-time,contractor */}
				<Text style={styles.jobType}>{job?.job_employment_type} (Viewed:{views} times)</Text>
			</View>
		</TouchableOpacity>
	);
};

export default NearbyJobCard;
