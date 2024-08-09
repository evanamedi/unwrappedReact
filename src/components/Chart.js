import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables, ChartDataLabels);

const ChartComponent = ({ data, title, isTimeSeries }) => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const ctx = canvasRef.current.getContext("2d");

		const labels = data.map((item) => item[0]);
		const values = data.map((item) => item[1]);

		// Find top 10 values and their indices
		const top10Indices = values
			.map((value, index) => ({ value, index }))
			.sort((a, b) => b.value - a.value)
			.slice(0, 10)
			.map((item) => item.index);

		const chartData = {
			labels: labels,
			datasets: [
				{
					label: title,
					data: values,
					backgroundColor: "rgba(75, 192, 192, .2)",
					borderColor: "rgba(75, 192, 192, 1)",
					borderWidth: 1,
				},
			],
		};

		const options = {
			scales: {
				x: {
					type: "category",
					beginAtZero: true,
					ticks: {
						color: "white", // Set text color to white
					},
				},
				y: {
					beginAtZero: true,
					ticks: {
						color: "white", // Set text color to white
					},
				},
			},
			plugins: {
				datalabels: {
					color: "white", // Set data label color to white
					anchor: "end",
					align: "top",
					formatter: (value, context) => {
						// Display data labels only for top 10 data points
						return top10Indices.includes(context.dataIndex)
							? value
							: null;
					},
				},
			},
		};

		// Create and apply gradient background to the chart
		const gradientBackground = ctx.createLinearGradient(
			0,
			0,
			canvasRef.current.width,
			0
		);
		gradientBackground.addColorStop(0.3, "rgb(0, 10, 14)");
		gradientBackground.addColorStop(0.7, "rgb(0, 24, 30)");
		gradientBackground.addColorStop(0.5, "rgb(0, 35, 41)");

		const drawBackground = () => {
			ctx.save();
			ctx.globalCompositeOperation = "destination-over";
			ctx.fillStyle = gradientBackground;
			ctx.fillRect(
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height
			);
			ctx.restore();
		};

		// Create the chart instance
		let chartInstance;
		if (isTimeSeries) {
			chartInstance = new Chart(ctx, {
				type: "line",
				data: chartData,
				options: options,
				plugins: [{ beforeDraw: drawBackground }], // Apply the background before drawing the chart
			});
		} else {
			chartInstance = new Chart(ctx, {
				type: "bar",
				data: chartData,
				options: options,
				plugins: [{ beforeDraw: drawBackground }], // Apply the background before drawing the chart
			});
		}

		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	}, [data, title, isTimeSeries]);

	// Download the chart as an image
	const downloadImage = () => {
		const link = document.createElement("a");
		link.href = canvasRef.current.toDataURL("image/png");
		link.download = `${title}.png`;
		link.click();
	};

	return (
		<div className="canvas-bg">
			<canvas ref={canvasRef} width={800} height={600} />
			<button className="select-button" onClick={downloadImage}>
				Download Chart
			</button>
		</div>
	);
};

export default ChartComponent;
