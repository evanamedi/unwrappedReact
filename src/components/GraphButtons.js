import React from "react";

const GraphButtons = ({ setSelectedChart }) => {
	return (
		<div id="graphButtons">
			<button
				className="select-button"
				onClick={() => setSelectedChart("topArtists")}>
				Show Top Artists
			</button>
			<button
				className="select-button"
				onClick={() => setSelectedChart("topSongs")}>
				Show Top Songs
			</button>
			<button
				className="select-button"
				onClick={() => setSelectedChart("listeningHistory")}>
				Show Listening History
			</button>
		</div>
	);
};

export default GraphButtons;
