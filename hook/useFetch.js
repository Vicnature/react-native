/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
import { cacheJobData, getCachedJobs } from "../utils/cache";
import { localJobDetailsStorage } from "../utils/sqlite";
import { saveData, readData } from "../utils/sqlite";
import { FirebaseJobCache } from "../utils/db";
// import {RAPID_API_KEY} from '@env'

// query is an object that stores the user's search parameters.
const useFetch = (endpoint, query) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const rapidApiKey = "7d1e92351dmshe786ad9a57d7051p147190jsn13457f868a93";
	// const rapidApiKey = "22faf0f14dmsh76cff1a6b8b43d2p1cdd93jsn2f0797d4bdb6";
	// const rapidApiKey = "00cca67dd1msh98ffc1c33478a0ap1ed7c5jsn89e80f8efd6a";
	// const rapidApiKey = "ff9ce63dcemsh8ed272dfb5baf99p16dd05jsn3059db53edef";
	// const rapidApiKey = "a525ccaca5mshae67f2d41f048c2p18c590jsnbda3a6854036";
	// const rapidApiKey = "8b81915545mshb30fd70b73f6b9ap121db6jsnb18f7e153069";
	// const rapidApiKey = "d9058b9297mshf2efadb1e725a01p1dc0f1jsncb768d00703b";
	const options = {
		method: "GET",
		url: `https://jsearch.p.rapidapi.com/${endpoint}`,
		headers: {
			"X-RapidAPI-Key": rapidApiKey,
			"X-RapidAPI-Host": "jsearch.p.rapidapi.com",
		},
		params: { ...query },
	};

	const fetchData = async () => {
		setIsLoading(true);

		try {
			const response = await axios.request(options);

			setData(response.data.data);
			setIsLoading(false);
		} catch (error) {
			// setError(error);
			console.error(error, "could not fetch jobs");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const refetch = () => {
		setIsLoading(true);
		fetchData();
	};

	return { data, isLoading, error, refetch };
};

//fetchdata
//fetchdata
export const fetchData = async (endpoint, query) => {
	console.log("attempting to fetch jobs");
	// const rapidApiKey = "7d1e92351dmshe786ad9a57d7051p147190jsn13457f868a93";
	// const rapidApiKey = "22faf0f14dmsh76cff1a6b8b43d2p1cdd93jsn2f0797d4bdb6";
	// const rapidApiKey = "00cca67dd1msh98ffc1c33478a0ap1ed7c5jsn89e80f8efd6a";
	// const rapidApiKey = "ff9ce63dcemsh8ed272dfb5baf99p16dd05jsn3059db53edef";
	// const rapidApiKey = "a525ccaca5mshae67f2d41f048c2p18c590jsnbda3a6854036";
	// const rapidApiKey = "8b81915545mshb30fd70b73f6b9ap121db6jsnb18f7e153069";
	// const rapidApiKey = "d9058b9297mshf2efadb1e725a01p1dc0f1jsncb768d00703b";
	const rapidApiKey = "0926e1a80cmshbe4870ea9f4d91bp16c6c7jsn8246069fd191";
	const options = {
		method: "GET",
		url: `https://jsearch.p.rapidapi.com/${endpoint}`,
		headers: {
			"X-RapidAPI-Key": rapidApiKey,
			"X-RapidAPI-Host": "jsearch.p.rapidapi.com",
		},
		params: { ...query },
	};

	try {
		const response = await axios.request(options);
		return response.data.data;
	} catch (error) {
		console.error(
			error,
			"could not fetch data using fetchData function in useFetch.js",
		);
		return null;
	}
};

export const ListOfAllCountries = async () => {
	try {
		const countries = await fetch("https://restcountries.com/v3.1/all");
		const countriesAsJson = await countries.json();
		const countryNames = [];
		countriesAsJson.forEach((country) => {
			countryNames.push(country.name.common);
		});
		return countryNames.length > 0 ? countryNames : null;
	} catch (error) {
		console.error("Could not fetch country data:", error);
	}
};

export const disintegrateJobData = async (
	data,
	IndividualJobName,
	FileName,
) => {
	try {
		const jobSummary = [];
		if (data) {
			console.log("Job is not empty. Beginning disintegration...");
			data.forEach((job) => {
				const individualJobDetails = {
					job_id: job.job_id,
					job_description: job.job_description,
					job_highlights: job.job_highlights,
					job_title: job.job_title,
					employer_name: job.employer_name,
					employer_logo: job.employer_logo,
					job_google_link: job.job_google_link,
					job_apply_link: job.job_apply_link,
				};
				saveData(
					JSON.stringify(individualJobDetails),
					`${IndividualJobName}_${job.job_id}`,
				);
				FirebaseJobCache(
					individualJobDetails,
					`${IndividualJobName}_${job.job_id}`,
				);
				jobSummary.push(individualJobDetails);
			});
			saveData(JSON.stringify(jobSummary), FileName);
			FirebaseJobCache(JSON.stringify(jobSummary), FileName);
			if (jobSummary !== null) return jobSummary;
		}
		// console.log("Job disintegrated successfully", JSON.stringify(jobSummary));
	} catch (error) {
		console.error("Failed to disintegrate the job data", error);
	}
};

export default useFetch;
