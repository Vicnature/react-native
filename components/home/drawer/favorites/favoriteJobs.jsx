/** @format */

// /** @format */

// import React from "react";
// import { useRouter } from "expo-router";
// import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

// import styles from "./nearbyjobs.style";
// import { COLORS } from "../../../constants";
// import NearbyJobCard from "../../common/cards/nearby/NearbyJobCard";
// import useFetch from "../../../hook/useFetch";
// import { fetchData } from "../../../hook/useFetch";
// import { cacheJobData, getCachedJobs } from "../../../utils/cache";
// import { useEffect, useState } from "react";

// const Nearbyjobs = () => {
// 	const [data, setData] = useState([]);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [error, setError] = useState(null);
// 	useEffect(() => {
// 		fetch();
// 		cacheJobDetails()
// 	}, []);

// 	const cacheJobDetails = async () => {
// 		try {
// 			setIsLoading(true)
// 			const cachedJobDetails = await getCachedJobs("jobDetails");
// 			if (cachedJobDetails !== null) {
// 				console.log(
// 					"jobDetails for each job has been retrieved from the cache successfully",
// 				);
// 			} else if (Array.isArray(data) && data.length > 0) {
// 				console.log("Initiating fetching of cumilative job details")
// 				const cumulativeJobDetails = [];
// 				for (const job of data) {
// 					const individualJobDetails = await fetchData("job-details", {
// 						job_id:job?.job_id,
// 					});

// 					cumulativeJobDetails.push(individualJobDetails);
// 				}
// 				if(cumulativeJobDetails!==null && cumulativeJobDetails.length>0){
// 					console.log("The cumilative fetch of job details had the following result:",Object.entries(cumulativeJobDetails))
// 					console.log("The cumilative job details object is the following size:",(cumulativeJobDetails.length))
// 				}const successfulJobDetailsCache = await cacheJobData("jobDetails",cumulativeJobDetails);
// 				if (successfulJobDetailsCache) console.log("jobDetails for each job has been cached successfully");
// 			}
// 		} catch (error) {
// 			console.error("Error when fetching cumilative job details",error);
// 		}
// 	};

// 	const fetch = async () => {
// 		try {
// 			setIsLoading(true);
// 			const cachedData = await getCachedJobs("jobData");
// 			if (cachedData) {
// 				console.log(
// 					"jobData for Nearby jobs has been  found within the local cache.",
// 				);
// 				setData(cachedData);
// 				setIsLoading(false);
// 				// const newData = await fetchData("search", {
// 				// 	query: "Mobile Application Developer",
// 				// 	num_pages: "1",
// 				// }); //try to make another fetch ,in order to update the cache
// 				// if (newData !== null) {
// 				// 	await cacheJobData("jobData", newData); // Update the cache with new data
// 				// 	console.log(
// 				// 		"Attempting to update the jobCache for Nearby jobs with newly fetched jobData",
// 				// 	);
// 				// 	setData(newData);
// 				// }
// 			} else {
// 				console.log("There is no jobData within the local cache.Currently making a new fetch for jobs.")
// 				const data = await fetchData("search", {
// 					query: "Mobile App Developer",
// 					num_pages: "1",
// 				});
// 				if (data) setData(data);
// 				// if (data) console.log("there is data returned and has been set:", data);
// 				if (data) await cacheJobData("jobData", data);
// 				if (data) setIsLoading(false);
// 			}
// 		} catch (error) {
// 			console.error("Error when fetching jobs using the fetch function in Nearbyjobs.jsx",error);
// 			setError(error);
// 		}
// 	};
// 	const router = useRouter();
// 	// const { data, isLoading, error } = useFetch("search", {
// 	// 	query: "Mobile App Developer",
// 	// 	num_pages: "1",
// 	// });
// 	// cacheJobData("jobData", data);

// 	return (
// 		<View style={styles.container}>
// 			<View style={styles.header}>
// 				<Text style={styles.headerTitle}>Nearby jobs</Text>
// 				<TouchableOpacity>
// 					<Text style={styles.headerBtn}>Show all</Text>
// 				</TouchableOpacity>
// 			</View>

// 			<View style={styles.cardsContainer}>
// 				{isLoading ? (
// 					<ActivityIndicator size="large" color={COLORS.primary} />
// 				) : error ? (
// 					<Text>Something went wrong</Text>
// 				) :
// 				Array.isArray(data) && data.length > 0 ? (
// 					data
// 					.filter((job) => job && job.job_id) // Filter out null/undefined items and items without job_id
// 					.map((job) => (
// 						<NearbyJobCard
// 							job={job}
// 							key={`nearby-job-${job.job_id}`}
// 							handleNavigate={() => router.push(`/job-details/${job.job_id}`)}
// 						/>
// 					))
// 			)  : (
// 					<Text>No jobs found</Text>
// 				)}
// 			</View>
// 		</View>
// 	);
// };

// export default Nearbyjobs;

import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./nearbyjobs.style";
import { COLORS } from "../../../constants";
import NearbyJobCard from "../../common/cards/nearby/NearbyJobCard";
import { fetchData } from "../../../hook/useFetch";
import { cacheJobData, getCachedJobs } from "../../../utils/cache";

export const favoriteJobs = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            await fetchJobData();
            // await cacheJobDetails();
        })();
    }, []);

    const fetchJobData = async () => {
        try {
            const cachedData = await getCachedJobs("jobData");
            if (cachedData !== null) {
                console.log("jobData found within the local cache.");
                setData(cachedData);
                setIsLoading(false);
                // console.log("attempting to replenish the cache")
                // const newData = await fetchData("search", {
                // 	query: "Mobile Application Developer",
                // 	num_pages: "1",
                // }); //try to make another fetch ,in order to update the cache
                // if (newData !== null) {
                // 	await cacheJobData("jobData", newData); // Update the cache with new data
                // 	console.log(
                // 		"Attempting to update the jobCache for Nearby jobs with newly fetched jobData"
                // 	,newData);
                // 	setData(newData);
                // }
            } else {
                console.log("No jobData in cache. Fetching new jobs.");
                const fetchedData = await fetchData("search", {
                    query: "Mobile App Developer",
                    num_pages: "1",
                });
                if (fetchedData && Array.isArray(fetchedData)) {
                    await cacheJobData("jobData", fetchedData);
                    setData(fetchedData);
                }
            }
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setIsLoading(false);
        }
    };

    // const cacheJobDetails = async () => {
    // 	try {
    // 		const cachedJobDetails = await getCachedJobs("jobDetails");
    // 		if (!cachedJobDetails && Array.isArray(data) && data.length > 0) {
    // 			console.log("Fetching cumulative job details");
    // 			const cumulativeJobDetails = [];
    // 			for (const job of data) {
    // 				if (job?.job_id) {
    // 					const individualJobDetails = await fetchData("job-details", {
    // 						job_id: job.job_id,
    // 					});
    // 					cumulativeJobDetails.push(individualJobDetails);
    // 				}
    // 			}
    // 			if (cumulativeJobDetails.length > 0) {
    // 				console.log("Caching cumulative job details");
    // 				await cacheJobData("jobDetails", cumulativeJobDetails);
    // 			}
    // 		}
    // 	} catch (err) {
    // 		console.error("Error caching job details:", err);
    // 	}
    // };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Nearby jobs</Text>
                <TouchableOpacity>
                    <Text style={styles.headerBtn}>Show all</Text>
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
                                handleNavigate={() => router.push(`/job-details/${job.job_id}`)}
                            />
                        ))
                ) : (
                    <Text>No jobs found</Text>
                )}
            </View>
        </View>
    );
};


