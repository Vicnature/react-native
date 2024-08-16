/** @format */

import { View, Text } from "react-native";

import styles from "./specifics.style";

const Specifics = ({ title, points }) => {
	return (
		<View style={styles.container}>
			{/* tab title->about,qualifications,responsibilites */}
			<Text style={styles.title}>{title}</Text>

			{/* shows the list of details for the specific tab chosen */}
      <View style={styles.pointsContainer}>
				{/* {points?.map((item, index) => (
					<View style={styles.pointWrapper} key={item + index}>
						<View style={styles.pointDot} />
						<Text style={styles.pointText}>{item}</Text>
					</View>
				))} */}

{Array.isArray(points) ? (
					points.map((item, index) => (
						<View style={styles.pointWrapper} key={item + index}>
							<View style={styles.pointDot} />
							<Text style={styles.pointText}>{item}</Text>
						</View>
					))
				) : (
					<Text style={styles.pointText}>{points}</Text>
				)}
			</View>
		</View>
	);
};

export default Specifics;
