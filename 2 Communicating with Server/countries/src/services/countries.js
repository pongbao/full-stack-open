import axios from "axios";
const countriesBaseUrl = "https://restcountries.com/v3.1/all";
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather?";
const api_key = process.env.REACT_APP_API_KEY;

const getCountries = () => {
  const request = axios.get(countriesBaseUrl);
  return request.then((response) => response.data);
};

const getWeather = (latLong) => {
  const request = axios.get(
    `${weatherBaseUrl}lat=${latLong.lat}&lon=${latLong.long}&appid=${api_key}&units=metric`
  );
  return request.then((response) => response.data);
};

const getAll = {
  getCountries,
  getWeather,
};

export default getAll;
