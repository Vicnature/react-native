/** @format */
import {
	View,
	Text,
	ScrollView,
	SafeAreaView,
	ActivityIndicator,
	RefreshControl,
	Share,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
	Company,
	JobAbout,
	JobFooter,
	JobTabs,
	ScreenHeaderBtn,
	Specifics,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";
import { fetchData } from "../../hook/useFetch";
import { cacheJobData, getCachedJobs } from "../../utils/cache";
import { readData, saveData } from "../../utils/sqlite";
import { FirebaseJobCache } from "../../utils/db";
import { UserContext } from "../_layout";
import { useContext } from "react";

const JobDetails = () => {
	// const params = useLocalSearchParams(); //get all parameters in the search string.Will help retrieve the id of the job clicked
	const route = useRoute();
	const { id, profession, job_preference } = route.params;
	const router = useRouter(); //allow to push to another route

	// const { data, isLoading, error, refetch } = useFetch("job-details", {
	// 	job_id: id,
	// }); //hit the job-details endpoint of RapidApi(Jseach) and provide the job-id(attained from the search parameters)
	const [refreshing, setRefreshing] = useState(false);
	const tabs = ["About", "Qualifications", "Responsibilities"];
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetch();
		setRefreshing(false);
	});

	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useContext(UserContext);
	useEffect(() => {
		fetchJobDetails();
	}, []);

	const fetchJobDetails = async () => {
		try {
			setIsLoading(true);
			console.log(
				"attempting to fetch job",
				id,
				"'s job details from the local fileSystem cache",
			);
			const dataArray = [];
			const cachedJobDetails =
				job_preference == null
					? await readData(`disintegratedJobDetails_${profession}_${id}`)
					: await readData(
							`disintegratedJobDetails_${profession}_{job_preference}_${id}`,
						);

			if (cachedJobDetails) {
				dataArray.push(cachedJobDetails);
				if (dataArray.length > 0) setData(dataArray);
			} else {
				throw new Error("No cached data found, triggering backup fetch");
			}
			setIsLoading(false);
		} catch (e) {
			console.error(
				"Failed to get this individual job's details from the local cache",
				e,
			);
			backupFetch();
		}
	};

	const backupFetch = async () => {
		try {
			setIsLoading(true);
			const individualJobDetails = await fetchData("job-details", {
				job_id: id,
			});
			if (individualJobDetails && individualJobDetails !== null) {
				setData(individualJobDetails);
				console.log("backup fetch used to get job details");
			}
			if (job_preference !== null) {
				await saveData(
					JSON.stringify(individualJobDetails),
					`disintegratedJobDetails_${profession}_${job_preference}_${id}`,
				);
				await FirebaseJobCache(
					individualJobDetails,
					`disintegratedJobDetails_${profession}_${job_preference}_${id}`,
				);
				setIsLoading(false);
			} else {
				await saveData(
					JSON.stringify(individualJobDetails),
					`disintegratedJobDetails_${profession}_${id}`,
				);
				await FirebaseJobCache(
					individualJobDetails,
					`disintegratedJobDetails_${profession}_${id}`,
				);
				setIsLoading(false);
			}
		} catch (e) {
			console.error("Backup fetch failed", e);
		}
	};

	const shareJobDetails = async () => {
		try {
			if (data && data != null) {
				const result = await Share.share({
					message: `Checkout this job I have found on Job Finders Application !! \n ${data[0]?.job_apply_link}`,
				});
			}
		} catch (e) {
			console.log("Failed to share", e);
		}
	};

	//delegates the display of specific job detail types(qualifications,responsibilities and about to the necessary components)
	const displayTabContent = () => {
		switch (activeTab) {
			case "Qualifications":
				return (
					<Specifics
						title="Qualifications"
						points={
							data[0]?.job_highlights?.Qualifications ??
							"No qualifications defined by the hiring company yet.Kindly check again later..."
						}
					/>
				);
			case "About":
				return (
					<JobAbout
						info={
							data[0]?.job_description ??
							"No information provided by the hiring company yet.Kindly check again later..."
						}
					/>
				);
			case "Responsibilities":
				return (
					<Specifics
						title="Responsibilities"
						points={
							data[0]?.job_highlights?.Responsibilities ??
							"No Responsibilities defined for this job yet.Kindly check later..."
						}
					/>
				);
		}
	};
	return (
		// ensures all areas of the page are visible
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightwhite }}>
			{/* header with back button,page title and share button */}
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: COLORS.lightwhite },
					headerShadowVisible: false,
					headerBackVisible: false,
					//custom back button
					headerLeft: () => (
						<ScreenHeaderBtn
							iconUrl={icons.left}
							dimension="60%"
							handlePress={() => router.back()}
						/>
					),
					//share button
					headerRight: () => (
						<ScreenHeaderBtn
							iconUrl={icons.share}
							dimension="60%"
							handlePress={shareJobDetails}
						/>
					),
					headerTitle: "",
				}}
			/>
			<>
				<ScrollView
					showsVerticalIndicator={false}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					{isLoading ? (
						<ActivityIndicator size="large" color={COLORS.primary} />
					) : error ? (
						<Text>
							Further details about this job are currently unavailable.Please
							wait for some time and check again later.
						</Text>
					) : data[0]?.length === 0 ? (
						<Text>No data</Text>
					) : (
						<View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
							<Company
								companyLogo={data[0]?.employer_logo}
								jobTitle={data[0]?.job_title}
								companyName={data[0]?.employer_name}
								location={data[0]?.job_country}
							/>
							<JobTabs
								tabs={tabs}
								activeTab={activeTab}
								setActiveTab={setActiveTab}
							/>

							{/* function that deals with displaying the content for the tab(about,responsibilities,qualifications) chosen by the user */}
							{displayTabContent()}
						</View>
					)}
				</ScrollView>

				{/* can be clicked to take you the job's application page */}
				{data && (
					<JobFooter
						// job={data[0].job_id}
						url={
							data[0]?.job_apply_link
								? data[0]?.job_apply_link
								: "https://careers.google.com/jobs.results"

							// data[0]?.job_google_link ? data[0]?.job_google_link : data[0]?.job_apply_link
							// "https://careers.google.com/jobs.results"
						}
					/>
				)}
			</>
		</SafeAreaView>
	);
};

export default JobDetails;
