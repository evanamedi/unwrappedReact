import React from "react";

const FileUploader = ({ setFilesData, processData }) => {
	const handleFiles = async (event) => {
		const files = event.target.files;
		let loadedData = [];

		const readFile = (file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					try {
						const json = JSON.parse(e.target.result);
						resolve(json);
					} catch (error) {
						reject(error);
					}
				};
				reader.readAsText(file);
			});
		};

		try {
			const filePromises = Array.from(files).map((file) =>
				readFile(file)
			);
			const fileDataArray = await Promise.all(filePromises);
			loadedData = fileDataArray.flat();
			setFilesData(loadedData);
			processData(loadedData); // Pass loadedData to processData
		} catch (error) {
			console.error("Error reading files:", error);
		}
	};

	return (
		<div>
			<input type="file" id="fileInput" multiple onChange={handleFiles} />
			<button id="processButton" onClick={() => processData()}>
				Process Data
			</button>
		</div>
	);
};

export default FileUploader;
