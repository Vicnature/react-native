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
			setError(error);
			alert(
				"An unexpected error has occured while fetching data.Our team is working to fix the inconvenience.Please try again later.Thankyou!",
			);
			console.error(error);
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

export default useFetch;
