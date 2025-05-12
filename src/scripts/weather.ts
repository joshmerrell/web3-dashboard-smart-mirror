// Import OpenWeatherMap API key from .env file
const API_KEY = import.meta.env.API_KEY;
// City
export const city = 'Spokane';
// Units for Farenheit
const units = 'imperial';

// URL query string
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;

// Using fetch to get data
const weatherData = await fetch(url).then(response => response.json())


// Check-check: Is data good? 
console.log(weatherData);

const code = weatherData.cod;

export const errorMessage = weatherData.message;
const hasError = code > 200;
export const iconURL = hasError?"":`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
export const weatherName = hasError?"":weatherData.weather[0].main;
export const weatherDescription = hasError?"":weatherData.weather[0].description;
export const temperature = weatherData.main?.temp;
export const feelsLike = weatherData.main?.feels_like;
export const humidity = weatherData.main?.humidity;
