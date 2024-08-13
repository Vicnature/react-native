/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
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
			console.error(error,"could not fetch jobs");
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
export default useFetch;
