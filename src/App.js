import React, { useState, useEffect } from "react";
import FileUploader from "./components/FileUploader";
import GraphButtons from "./components/GraphButtons";
import Chart from "./components/Chart";
import SynthWave from "./components/SynthWave";
import "./styles.css";

const App = () => {
	const [chartsData, setChartsData] = useState(null);
	const [selectedChart, setSelectedChart] = useState(null);

	useEffect(() => {
		const loadAndProcessFiles = async () => {
			try {
				const response = await fetch("data/");
				const text = await response.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(text, "text/html");
				const fileLinks = Array.from(doc.querySelectorAll("a"))
					.map((link) => link.getAttribute("href"))
					.filter((href) => href.endsWith(".json"));

				let allData = [];
				for (const fileName of fileLinks) {
					const fileResponse = await fetch(`data/${fileName}`);
					const fileData = await fileResponse.json();
					allData = allData.concat(fileData);
				}
				processData(allData);
			} catch (error) {
				console.error("Error loading files:", error);
			}
		};

		loadAndProcessFiles();

		// Show the continue button after 4 seconds
		setTimeout(() => {
			const continueButton = document.getElementById("continue-button");
			continueButton.classList.remove("hidden");
			continueButton.classList.add("fade-in");
		}, 4000);
	}, []);

	const processData = (data) => {
		if (!data || !Array.isArray(data)) {
			console.error("Invalid data provided to processData");
			return;
		}

		const topArtists = {};
		const topSongs = {};
		const listeningHistory = {};

		data.forEach((entry) => {
			const isNewFormat =
				entry.artistName && entry.trackName && entry.endTime;

			const artist = isNewFormat
				? entry.artistName
				: entry.master_metadata_album_artist_name;
			const song = isNewFormat
				? entry.trackName
				: entry.master_metadata_track_name;
			const playedAt = new Date(isNewFormat ? entry.endTime : entry.ts);

			if (artist && artist !== "Unknown Artist") {
				topArtists[artist] = (topArtists[artist] || 0) + 1;
			}

			if (song && song !== "Unknown Song") {
				topSongs[song] = (topSongs[song] || 0) + 1;
			}

			const dateKey = playedAt.toISOString().split("T")[0];
			listeningHistory[dateKey] = (listeningHistory[dateKey] || 0) + 1;
		});

		const sortedArtists = Object.entries(topArtists)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10);
		const sortedSongs = Object.entries(topSongs)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10);
		const sortedListeningHistory = Object.entries(listeningHistory).sort(
			(a, b) => new Date(a[0]) - new Date(b[0])
		);

		setChartsData({
			topArtists: sortedArtists,
			topSongs: sortedSongs,
			listeningHistory: sortedListeningHistory,
		});
		setSelectedChart("topArtists");
	};

	return (
		<div>
			<SynthWave />
			<div id="content" className="content" style={{ display: "none" }}>
				<div className="container">
					<h1>Unwrapped</h1>
					<FileUploader
						setFilesData={() => {}}
						processData={processData}
					/>
					<GraphButtons setSelectedChart={setSelectedChart} />
					{chartsData && (
						<Chart
							data={chartsData[selectedChart]}
							title={
								selectedChart === "topArtists"
									? "Top 10 Artists"
									: selectedChart === "topSongs"
									? "Top 10 Songs"
									: "Listening History"
							}
							isTimeSeries={selectedChart === "listeningHistory"}
							displayCounts={selectedChart !== "listeningHistory"}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default App;
