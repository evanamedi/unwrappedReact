import React from "react";

export default function SynthWave() {
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
			<p className="jacob">hey jacob...</p>
		</div>
	);
}
