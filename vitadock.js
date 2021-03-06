/* global Module, Chart, moment */

/* Magic Mirror
 * Module: vitadock
 *
 * By Chris van Marle
 * MIT Licensed.
 */

Module.register("vitadock",{

	// Default module config.
	defaults: {
		timespan: 365/2, // half a year in days
	},

	getScripts: function() {
		return ["moment.js", this.file("node_modules/chart.js/dist/Chart.min.js")];
	},

	start: function() {
		this.chartData = {
			labels: [],
			datasets: []
		}
		this.hasCreds = false;

		if(this.config.credentials !== undefined) {
			this.hasCreds = true;
			this.sendSocketNotification("ADD_VITADOCK", this.config);
		}
	},

	socketNotificationReceived: function(notification, payload) {
		//console.log("vitadock, socketNotificationReceived:", notification, payload);
		if (notification === "VITADOCK_TARGETSCALES") {
			if (payload.id === this.config.credentials.oauthToken) {
				var labels = [];
				var dataWeight = [];
				var dataFat = [];

				payload.data.forEach(function(row) {
					labels.push(new Date(row.measurementDate));
					dataWeight.push(row.bodyWeight);
					dataFat.push(row.bodyFat);
				});

				this.myChart.data.labels = labels;
				this.myChart.data.datasets[0].data = dataWeight;
				this.myChart.data.datasets[1].data = dataFat;
				this.myChart.update();
			}
		}
	},

	updateChartData: function() {
		if(this.myChart !== undefined) {
			this.myChart.data.labels = this.chartData.labels;
			for(var i=0; i<this.myChart.data.datasets.length && i<this.chartData.datasets.length; ++i) {
				this.myChart.data.datasets[i].data = this.chartData.datasets[i];
			}
			this.myChart.update();
		}
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if(!this.hasCreds) {
			wrapper.innerHTML = "Configure Vitadock credentials!";
			wrapper.className = "small";
			return wrapper;
		}

		this.ctx = document.createElement("canvas");
		this.ctx.style.width = "300px";
		this.ctx.style.height = "200px";
		wrapper.appendChild(this.ctx);

		this.myChart = new Chart(this.ctx, {
			type: "line",
			data: {
				labels: [],
				datasets: [{
					label: "Gewicht",
					yAxisID: "y-axis-0",
					borderColor: "rgba(255, 255, 255, 1)",
					backgroundColor: "rgba(255, 255, 255, 1)",
					fill: false,
					data: [],
				},
				{
					label: "Vet",
					yAxisID: "y-axis-1",
					borderColor: "rgba(153, 153, 153, 1)",
					backgroundColor: "rgba(153, 153, 153, 1)",
					fill: false,
					data: []
				}]
			},
			options: {
				responsive: true,
				legend: {
					display: false
				},
				tooltips: {
					mode: "index",
					callbacks: {
						title: function(ti, data) {
							return moment(this._data.labels[ti[0].index]).format("DD MMM 'YY");
						},
						label: function(ti, data) {
							if (ti.datasetIndex == 0) {
								return data.datasets[ti.datasetIndex].data[ti.index] + " kg";
							} else if(ti.datasetIndex == 1) {
								return data.datasets[ti.datasetIndex].data[ti.index] + " %";
							} else {
								return data.datasets[ti.datasetIndex].data[ti.index].toString();
							}
						}
					}
				},
				elements: {
					point: {
						radius: 0,
						hitRadius: 6,
						hoverRadius: 6,
					}
				},
				scales: {
					xAxes: [{
						type: "time",
						time: {
							unit: "day",
						},
						gridLines: {
							color: "rgba(255, 255, 255, 0.1)"
						},
						ticks: {
							callback: function(val, idx, values) {
								if(values[idx] && values[idx].date && values[idx].date() == 1) {
									return values[idx].format("MMM'YY");
								} else {
									return null;
								}
							}
						}
					}],
					yAxes: [{
						position: "left",
						id: "y-axis-0",
						scaleLabel: {
							display: false,
							labelString: "kg"
						},
						gridLines: {
							color: "rgba(255, 255, 255, 0.1)"
						},
						ticks: {
							fontColor: "rgba(255, 255, 255, 1)",
							callback: function(val) {
								return val + " kg";
							}
						}
					},
					{
						position: "right",
						id: "y-axis-1",
						scaleLabel: {
							display: false,
							labelString: "vet"
						},
						gridLines: {
							color: "rgba(255, 255, 255, 0.1)"
						},
						ticks: {
							fontColor: "rgba(255, 255, 255, 0.6)",
							callback: function(val) {
								return val + "%";
							}
						}
					}]
				}
			}
		});

		this.updateChartData();

		return wrapper;
	}
});
