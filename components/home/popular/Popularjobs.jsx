/** @format */

import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
} from "react-native";

import styles from "./popularjobs.style";
import { COLORS, SIZES } from "../../../constants";
import PopularJobCard from "../../common/cards/popular/PopularJobCard";
import useFetch from "../../../hook/useFetch";
import { fetchData, disintegrateJobData } from "../../../hook/useFetch";
import { cacheJobData, getCachedJobs } from "../../../utils/cache";
import {
	FirebaseJobCache,
	retrieveJobsFromFirestoreCache,
	getDocFromFirestoreDb,
} from "../../../utils/db";
import { getDisintegratedJobDetails } from "../../../utils/sqlite";
import { readData } from "../../../utils/sqlite";

const Popularjobs = ({ query, user }) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch();
		// retrieveJobsFromFirestoreCache();
		// getDocFromFirestoreDb()
	}, [user]);

	const fetch = async () => {
		try {
			setIsLoading(true);
			// Try to fetch from local cache first
			const cachedData = await readData(
				`fullDisintegratedJobDetails_${user.profession}`,
			);
			if (cachedData && cachedData !== null) {
				// console.log("POPULAR JOBS:disintegratedJobDetails fetched from local cache successfully",(cachedData[0]))
				setData(cachedData);
				setIsLoading(false);
				return; // Exit the function if cached data is found
			} else {
				console.log(
					"no job data in the local cache.Trying to fetch from firestore database",
				);
				// const secondCache = await getDocFromFirestoreDb(`jobDetails`,`fullDisintegratedJobDetails_${user.profession}`);
				const secondCache = await getDocFromFirestoreDb(
					`jobDetailsCache`,
					`fullDisintegratedJobDetails_${user.profession}`,
				);
				if (secondCache && secondCache !== null) {
					setData(secondCache);
					setIsLoading(false);
					return; // Exit the function if data is found in Firestore cache
				}
			}

			// If both caches are empty, fetch from the endpoint
			const data = await fetchData("search", {
				query: query,
				num_pages: "1",
			});
			// const data = await fetchData("search", {
			// 	query: "Musician",
			// 	num_pages: "1",
			// });

			if (data && data !== null) {
				// Replenish cache with the fetched data
				// await cacheJobData("jobSummary", data);
				disintegrateJobData(
					data,
					`disintegratedJobDetails_${user.profession}`,
					`fullDisintegratedJobDetails_${user.profession}`,
				);
				setData(data);
				setIsLoading(false);
			}
		} catch (error) {
			console.error(error, "There was an error encountered when fetching data");
		}
	};

	const router = useRouter();
	//useFetch takes in two arguments,the endpoint and the query(an object which is destructured to get the params of the request)
	// const { data, isLoading, error } = useFetch("search", {
	// 	query: "React developer",
	// 	num_pages: "1",
	// });

	const [selectedJob, setSelectedJob] = useState();

	const handleCardPress = (item) => {
		router.push(`/job-details/${item.job_id}?profession=${user?.profession}`);
		setSelectedJob(item.job_id);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Popular jobs</Text>
				<TouchableOpacity>
					<Text style={styles.headerBtn}>Highest Paying Jobs</Text>
				</TouchableOpacity>
			</View>

			{/* actual jobs */}
			<View style={styles.cardsContainer}>
				{isLoading ? (
					//react built-in spinner that shows when something is loading
					<ActivityIndicator size="large" color={COLORS.primary} />
				) : error ? (
					<Text>Nothing to show you yet</Text>
				) : (
					<FlatList
						data={data}
						renderItem={({ item }) => (
							<PopularJobCard
								item={item}
								selectedJob={selectedJob}
								handleCardPress={handleCardPress}
							/>
						)}
						keyExtractor={(item) => item?.job_id}
						contentContainerStyle={{ columnGap: SIZES.medium }}
						horizontal
					/>
				)}
			</View>
		</View>
	);
};

export default Popularjobs;
