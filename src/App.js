import React, { useState, useEffect } from "react";
import FileUploader from "./components/FileUploader";
import GraphButtons from "./components/GraphButtons";
import Chart from "./components/Chart";
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
			const artist = entry.master_metadata_album_artist_name;
			const song = entry.master_metadata_track_name;
			const playedAt = new Date(entry.ts);

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

	const fadeOutIntro = () => {
		const intro = document.getElementById("welcome-intro");
		intro.style.transition = "opacity 1s";
		intro.style.opacity = "0";
		setTimeout(() => {
			intro.style.display = "none";
			document.getElementById("content").style.display = "block";
		}, 1000);
	};

	return (
		<div>
			<div id="welcome-intro">
				<div className="synth-wave">
					<div className="bar"></div>
					<div className="bar"></div>
					<div className="bar"></div>
					<div className="bar"></div>
					<div className="bar"></div>
					<div className="bar"></div>
					<div className="bar"></div>
					<div className="bar"></div>
					<div className="bar"></div>
					<div className="bar"></div>
				</div>
				<div className="button-container">
					<button
						id="continue-button"
						className="button-common hidden"
						onClick={fadeOutIntro}>
						Let's Unwrap
					</button>
				</div>
				<div className="synth-wave2">
					<div className="bar2"></div>
					<div className="bar2"></div>
					<div className="bar2"></div>
					<div className="bar2"></div>
					<div className="bar2"></div>
					<div className="bar2"></div>
					<div className="bar2"></div>
					<div className="bar2"></div>
					<div className="bar2"></div>
					<div className="bar2"></div>
				</div>
			</div>
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
