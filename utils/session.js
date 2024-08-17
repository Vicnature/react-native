/** @format */

import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSession = () => {
	const [session, setSession] = useState(null);

	const createSession = async (userData) => {
		await AsyncStorage.setItem("session", JSON.stringify(userData));
		setSession(userData);
	};

	const getSession = async () => {
		const sessionData = await AsyncStorage.getItem("session");
		if (sessionData) {
			setSession(JSON.parse(sessionData));
		}
	};

	const clearSession = async () => {
		await AsyncStorage.removeItem("session");
		setSession(null);
	};

	return { session, createSession, getSession, clearSession };
};
