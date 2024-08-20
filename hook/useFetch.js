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

	const rapidApiKey = "'a8eff050e5mshf564edb900d38efp102487jsnd71a7c0d6bd6";
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


export const fetchData = async (endpoint, query) => {
	console.log("attempting to fetch jobs");
	const rapidApiKey = "'a8eff050e5mshf564edb900d38efp102487jsnd71a7c0d6bd6";
	// const rapidApiKey = "'a8eff050e5mshf564edb900d38efp102487jsnd71a7c0d6bd6";
	// const rapidApiKey = "'a8eff050e5mshf564edb900d38efp102487jsnd71a7c0d6bd6";
	// const rapidApiKey = "'a8eff050e5mshf564edb900d38efp102487jsnd71a7c0d6bd6";
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
					job_employment_type: job.job_employment_type,
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
