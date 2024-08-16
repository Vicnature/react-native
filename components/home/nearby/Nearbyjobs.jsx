/** @format */

// /** @format */


import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./nearbyjobs.style";
import { COLORS } from "../../../constants";
import NearbyJobCard from "../../common/cards/nearby/NearbyJobCard";
import { cacheJobData, getCachedJobs } from "../../../utils/cache";
import { getDisintegratedJobDetails } from "../../../utils/sqlite";
import { readData } from "../../../utils/sqlite";
import { fetchData, disintegrateJobData } from "../../../hook/useFetch";
import { getDocFromFirestoreDb } from "../../../app/db";
import { saveData } from "../../../utils/sqlite";

const Nearbyjobs = ({query,job_preference,user}) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();

	useEffect(() => {
		fetch()
	}, [user]);

	const fetch = async () => {
		try {
			setIsLoading(true);
			const cachedData = await readData(`fullDisintegratedJobDetails_2_${user.profession}`);
			if (cachedData && cachedData!==null) {
				console.log("disintegratedJobDetails fetched from local cache successfully",Object.keys(cachedData[0]))
				setData(cachedData);
				setIsLoading(false);
				return; // Exit the function if cached data is found
			}
			else {
				console.log("no job data in the local cache.Trying to fetch from firestore database")
				const secondCache = await getDocFromFirestoreDb(`fullDisintegratedJobDetails_2_${user.profession}`);
				if (secondCache) {
					setData(secondCache);
					setIsLoading(false);
					return; // Exit the function if data is found in Firestore cache
				}
			}

			// If both caches are empty, fetch from the endpoint
			const data = await fetchData("search", {
				// query: query,
				query: user?.profession || query,
				employment_types:job_preference,
				num_pages: "1",
			});
			// const data = await fetchData("search", {
			// 	query: "Mobile App Developer",
			// 	num_pages: "1",
			// });

			if (data) {
				// Replenish cache with the fetched data
				// await cacheJobData("jobSummary", data);
				setData(data);
				// const disintegrated=await disintegrateJobData(data,"fullDisintegratedJobDetails_2");
				const disintegrated=await disintegrateJobData(data,`disintegratedJobDetails_${user.profession}`,`fullDisintegratedJobDetails_2_${user.profession}`);
				if(disintegrated) setIsLoading(false);
			}
		} catch (error) {
			console.error(error, "There was an error encountered when fetching data");
		}
	};

	
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>For You</Text>
				<TouchableOpacity>
					<Text style={styles.headerBtn}>Jobs that suit you</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.cardsContainer}>
				{isLoading ? (
					<ActivityIndicator size="large" color={COLORS.primary} />
				) : error ? (
					<Text>Something went wrong</Text>
				) : Array.isArray(data) && data.length > 0 ? (
					data
						.filter((job) => job && job.job_id) // Filter out null/undefined items and items without job_id
						.map((job) => (
							<NearbyJobCard
								job={job}
								key={`nearby-job-${job.job_id}`}
								handleNavigate={() => router.push(`/job-details/${job.job_id}?profession=${user?.profession}`)}
							/>
						))
				) : (
					<Text>No jobs found</Text>
				)}
			</View>
		</View>
	);
};

export default Nearbyjobs;
