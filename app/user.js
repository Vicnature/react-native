/** @format */
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
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
} from "../components";
// import { COLORS, icons, SIZES } from "../../constants";
// import useFetch from "../../hook/useFetch";
import { fetchData } from "../hook/useFetch";
// import { cacheJobData, getCachedJobs } from "../../utils/cache";
const JobDetails = () => {
    // const params = useLocalSearchParams(); //get all parameters in the search string.Will help retrieve the id of the job clicked
    const route = useRoute();
    const { id } = route.params;
    const router = useRouter(); //allow to push to another route

    // const { data, isLoading, error, refetch } = useFetch("job-details", {
    // 	job_id: id,
    // }); //hit the job-details endpoint of RapidApi(Jseach) and provide the job-id(attained from the search parameters)
    const [refreshing, setRefreshing] = useState(false);
    const tabs = ["About", "Qualifications", "Responsibilities"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch();
        setRefreshing(false);
    });

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
    }, []);

    //delegates the display of specific job detail types(qualifications,responsibilities and about to the necessary components)
    const displayTabContent = () => {
        switch (activeTab) {
            case "Qualifications":
                return (
                    <Specifics
                        title="Qualifications"
                        points={data[0].job_highlights?.Qualifications ?? ["N/A"]}
                    />
                );
            case "About":
                return (
                    <JobAbout info={data[0].job_description ?? "No data provided"} />
                );
            case "Responsibilities":
                <Specifics
                    title="Responsibilities"
                    points={data[0].job_highlights?.Responsibilities ?? ["N/A"]}
                />;
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
                            // handlePress={() => router.back()}
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
                    ) : data.length === 0 ? (
                        <Text>No data</Text>
                    ) : (
                        <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
                            <Company
                                companyLogo={data[0].employer_logo}
                                jobTitle={data[0].job_title}
                                companyName={data[0].employer_name}
                                location={data[0].job_country}
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
                    job={data[0].job_id}
                        url={
                            data[0]?.job_google_link ??
                            "https://careers.google.com/jobs.results"
                        }
                    />
                )}
            </>
        </SafeAreaView>
    );
};

export default JobDetails;
