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
	FirebaseAppliedJobs,
} from "../../../utils/db";
import { getDisintegratedJobDetails } from "../../../utils/sqlite";
import { readData } from "../../../utils/sqlite";
import { UserContext } from "../../../app/_layout";
import { useContext } from "react";

const Popularjobs = ({ query }) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const { user } = useContext(UserContext);
	useEffect(() => {
		fetch();
		// setError("there is an error")
		// setIsLoading(true)
	}, [user]);

	const fetch = async () => {
		try {
			setIsLoading(true);
			// Try to fetch from local cache first

			const cachedData = await readData(`fullDisintegratedJobDetails`);
			if (cachedData && cachedData !== null) {
				setData(cachedData);
				setIsLoading(false);
				return;
			} else {
				console.log(
					"no job data in the local cache.Trying to fetch popular jobs from firestore database",
				);

				// Try to fetch from Firestore database if no data is found within the local cache
				const secondCache = await getDocFromFirestoreDb(
					`jobDetailsCache`,
					`fullDisintegratedJobDetails`,
				);
				if (secondCache && secondCache !== null) {
					setData(JSON.parse(secondCache.jobDetails));
					setIsLoading(false);
					return;
				}
			}

			// If both caches are empty, fetch from the endpoint
			const data = await fetchData("search", {
				query: query,
				num_pages: "1",
			});
			if (data && data !== null) {
				disintegrateJobData(
					data,
					`disintegratedJobDetails`,
					`fullDisintegratedJobDetails`,
				);
				setData(data);
				setIsLoading(false);
			}
		} catch (error) {
			console.error(error, "There was an error encountered when fetching data");
			setError(error);
		}
	};

	const router = useRouter();
	//useFetch takes in two arguments,the endpoint and the query(an object which is destructured to get the params of the request)
	// const { data, isLoading, error } = useFetch("search", {
	// 	query: "React developer",
	// 	num_pages: "1",
	// });

	const [selectedJob, setSelectedJob] = useState();

	const handleCardPress = async (item) => {
		router.push(`/job-details/${item.job_id}?profession=${user?.profession}`);
		await FirebaseAppliedJobs(false, `ViewedPopularJobs/${item?.job_id}`);
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
					<Text>
						An error occured while fetching jobs.Please try again later.
					</Text>
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
