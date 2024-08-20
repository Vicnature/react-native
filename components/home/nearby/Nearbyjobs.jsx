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
import { getDocFromFirestoreDb } from "../../../utils/db";
import { saveData } from "../../../utils/sqlite";

const Nearbyjobs = ({ query, job_preference, user }) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();
	useEffect(() => {
		fetch();
	}, [user,job_preference]);

	const fetch = async () => {
		try {
			setIsLoading(true);
			console.log("fetching jobs for", user.name);
			const cachedData = await readData(
				`fullDisintegratedJobDetails_2_${user?.profession}_${user?.job_preference}`,
			);
			if (cachedData && cachedData !== null) {
				console.log(
					"NEARBY JOBS:fullDisintegratedJobDetails_2_",user?.profession," fetched from local cache successfully",
					Object.keys(cachedData[0]),
				);
				setData(cachedData);
				setIsLoading(false);
				return; // Exit the function if cached data is found
			} else {
				console.log(
					"no job data in the local cache.Trying to fetch from firestore database",
				);
				const secondCache = await getDocFromFirestoreDb(
					"jobDetailsCache",
					`fullDisintegratedJobDetails_2_${user?.profession}_${user?.job_preference}`,
				);
				if (secondCache && secondCache!==null) {
					setData(JSON.parse(secondCache.jobDetails));
					setIsLoading(false);
					return;
				}
			}

			// If both caches are empty, fetch from the endpoint
			const data = await fetchData("search", {
				query: user?.profession || query,
				employment_types: job_preference,
				num_pages: "1",
			});
			if (data) {
				// Replenish cache with the fetched data
				// await cacheJobData("jobSummary", data);
				setData(data);
				// const disintegrated=await disintegrateJobData(data,"fullDisintegratedJobDetails_2");
				const disintegrated = await disintegrateJobData(
					data,
					`disintegratedJobDetails_${user?.profession}_${user.job_preference}`,
					`fullDisintegratedJobDetails_2_${user?.profession}_${user?.job_preference}`,
				);
				if (disintegrated) setIsLoading(false);
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
					<Text>
						An error occured while fetching jobs,please try again later.
					</Text>
				) : Array.isArray(data) && data.length > 0 ? (
					data
						.filter((job) => job && job.job_id) // Filter out null/undefined items and items without job_id
						.map((job) => (
							<NearbyJobCard
								job={job}
								key={`nearby-job-${job.job_id}`}
								handleNavigate={() =>
									router.push(
										`/job-details/${job.job_id}?profession=${user?.profession}&job_preference=${user?.job_preference}`
										,
									)
								}
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
