import React, { useState, useEffect } from 'react';
import './style.css';
import { citiesData } from './data/citiesData';

export default function App() {
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWeatherDetails = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/group?id=${id}&units=metric&appid=<YOUR_APP_ID>`
      );

      const json = await response.json();
      setWeather(json);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterCountry = (id) => {
    const filteredData = citiesData.filter((item) => item.country === id);
    setCities(filteredData);
  };

  const getActiveCity = (id) => {
    const selectedCity = cities.find((item) => item.id === id);
    if (selectedCity) {
      setCity(selectedCity);
      getWeatherDetails(selectedCity.id);
    }
  };

  useEffect(() => {
    filterCountry();
  }, []);

  return (
    <div>
      <div className="top-panel">
        <button onClick={() => filterCountry('IN')}>India</button>
        <button onClick={() => filterCountry('PK')}>Pakistan</button>
        <button onClick={() => filterCountry('US')}>United States</button>
      </div>

      <div className="container">
        <div>
          <ul className="side-panel">
            {cities.map((city) => (
              <li key={city.id} onClick={() => getActiveCity(city.id)}>
                {city.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {city && (
            <table>
              <tbody>
                <tr>
                  <td>City Name</td>
                  <td>{city?.name}</td>
                </tr>
                <tr>
                  <td>City Location</td>
                  <td>
                    {city?.coord.lon} || {city?.coord.lat}
                  </td>
                </tr>
                <tr>
                  <td>Country</td>
                  <td>{city?.country}</td>
                </tr>
                {weather && weather.list && weather.list[0] && (
                  <>
                    <tr>
                      <td>Weather Details</td>
                      <td>
                        {loading
                          ? 'Loading...'
                          : weather.list[0].weather[0].main +
                            ' || ' +
                            weather.list[0].weather[0].description}
                      </td>
                    </tr>
                    <tr>
                      <td>Climate condition</td>
                      <td>
                        {loading
                          ? 'Loading...'
                          : weather.list[0].main.temp +
                            ' || ' +
                            weather.list[0].main.feels_like}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
