import getAll from "../services/countries";
import { useState, useEffect } from "react";

const CountryInfo = ({ countriesToShow }) => {
  const country = countriesToShow[0];
  const [weather, setWeather] = useState(null);

  const hook = () => {
    if (country) {
      const latLong = {
        lat: country.latlng[0],
        long: country.latlng[1],
      };
      getAll.getWeather(latLong).then((w) => setWeather(w));
    }
  };

  useEffect(hook, [country]);

  if (!country || countriesToShow.length > 1) {
    return null;
  }

  console.log(weather);
  console.log(weather.weather[0].icon);
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <div>latitude: {country.latlng[0]}</div>
      <div>longitude: {country.latlng[1]}</div>
      <h3>Languages:</h3>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.svg} alt={country.flags.src} width="150" />
      <h3>Weather in {country.capital}</h3>
      <div>temperature {weather.main.temp} Celsius</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={`https://openweathermap.org/img/wn/${weather.weather[0].description}@2x.png`}
        width="150"
      />
      <div>wind {weather.wind.speed} m/s</div>
    </>
  );
};

export default CountryInfo;
