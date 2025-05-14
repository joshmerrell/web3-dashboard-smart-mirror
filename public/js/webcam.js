// Check-check: webcam.js file is loaded
// console.log('Web Cam');

// Get Video
const video = document.querySelector("video");

// Navigator object
if (navigator.mediaDevices.getUserMedia) {
  
  navigator.mediaDevices
	.getUserMedia({
	  video: true
	})
	.then((stream) => (video.srcObject = stream))
	.catch((error) => {
		console.log(error);
		const golScript = document.createElement("script");
		golScript.src = "/js/gol.js";
		golScript.onload = () => {
			console.log("Game of Life script loaded.");
		};
		document.body.appendChild(golScript);
	});
}
