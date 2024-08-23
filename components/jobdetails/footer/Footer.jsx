/** @format */

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { FirebaseAppliedJobs } from "../../../utils/db";
import styles from "./footer.style";
import { icons } from "../../../constants";
import { getDatabase, ref, onValue } from "firebase/database";

const Footer = ({ url, job_id }) => {
	const [applications, setApplications] = useState(0);

	useEffect(() => {
		const db = getDatabase();
		const jobRef = ref(db, `AppliedJobs/${job_id}`);
		onValue(jobRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setApplications(data.likeCount || 0);
			}
		});
	}, [job_id]);

	const handleApplication = async () => {
		await FirebaseAppliedJobs(false, `AppliedJobs/${job_id}`);
		setAppliedByCurrentUser(!appliedByCurrentUser);
	};

	return (
		<View style={styles.container}>
			{/* Button for liking a job */}
			<TouchableOpacity style={styles.Applications}>
				{/* <Image
					source={likedByCurrentUser ? icons.heartFilled : icons.heartOutline}
					resizeMode="contain"
					style={styles.coloredLikeBtnImage}
				/> */}
				<Text style={{}}>Number of Attempted Applications : {applications}</Text>
			</TouchableOpacity>

			{/* Button used to apply for a given job */}
			<TouchableOpacity
				style={styles.applyBtn}
				onPress={() => {
					handleApplication();
					Linking.openURL(url);
				}}
			>
				<Text style={styles.applyBtnText}>Apply for this job</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Footer;
