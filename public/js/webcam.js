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
	.catch((error) => console.log(error));
}
