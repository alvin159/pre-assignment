import React, { useState } from 'react';

function Card() {  
  const [latitudePosition, setlatitudePosition] = useState('');
  const [longitudePosition, setlongitudePosition] = useState('');
  const [query, setQuery] = useState('');
  const [icon, setIcon] = useState('');
  const [location, setLocation] = useState([]);
  const [forecast, setforecast] = useState({});
  const API_KEY = 'ptR281npHPuBdVyGPQL3fWvChLbGQFnL';
  const API_HOST = 'http://dataservice.accuweather.com/';
  const API_VERSION = 'v1';

  const search = evt => {
    if (evt.key === "Enter") {      
      fetch(`${API_HOST}locations/${API_VERSION}/cities/search?apikey=${API_KEY}&q=${query}`)
        .then(res => res.json())
        .then(result => {
          setLocation(result[0]);
          console.log("LOCATION");
          console.log(result[0]);     
          if(location.Key !== undefined) {
            weather()
          }    
        })
        .catch(function(error) {
            alert("Not a valid city name", error);
        });
        setTimeout(() => {}, 1000)
    }
  }
  const geolocation = () => {
    navigator.geolocation.getCurrentPosition(function(position) {
        setlongitudePosition(position.coords.longitude);
        setlatitudePosition(position.coords.latitude);
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
    });   
    if (latitudePosition !== "" && longitudePosition !== ""){
      fetch(`${API_HOST}locations/${API_VERSION}/cities/geoposition/search?apikey=${API_KEY}&q=${latitudePosition}%2C${longitudePosition}`)
        .then(res => res.json())
        .then(result => {
          setLocation(result);
          setQuery('');
          console.log("LOCATION");
          console.log(result);      
          if(location.Key !== undefined) {
            weather()
          }
        })
        .catch(function(error) {
            alert("Not a valid city name", error);
        });
    }   
  }

  const weather = () => {
    fetch(`${API_HOST}forecasts/${API_VERSION}/daily/1day/${location.Key}?apikey=${API_KEY}&metric=true`)
        .then(res => res.json())
        .then(result => {
        setforecast(result);
        setQuery('');
        console.log("FORECAST");
        console.log(result);
        if (forecast.DailyForecasts[0].Day.Icon < 10) {setIcon("0"); console.log("icon"+icon)} else {setIcon("");console.log("icon"+icon)}
      })
      .catch(function(error) {
        console.log('Looks like there was a problem: ', error);
        });
  }
  const geo = () => {
    for (var i = 0; i < 3; i++) {
      (function(index) {
          setTimeout(function() {
            geolocation()
          }, i * 1000);
      })(i);
  }
  }

  return (
    <div className={'app'}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
          <div className="button" onClick={geo}>
            Get Current Location
          </div>
        </div>
        {(typeof forecast.DailyForecasts != "undefined") ? (
        <div>
          <div className="weather-box">
            <div className="weather">{location.EnglishName}, {location.Country.ID}</div>
          </div>
          <div className="weather-box">
            <div className="weather">
              {forecast.DailyForecasts[0].Temperature.Maximum.Value}°{forecast.DailyForecasts[0].Temperature.Maximum.Unit}
            </div>
            <div className="image">
            <img 
            src={`https://developer.accuweather.com/sites/default/files/${icon}${forecast.DailyForecasts[0].Day.Icon}-s.png`}
            alt="type the city again! or press the button!"
            /></div>
            <div className="weather">{forecast.DailyForecasts[0].Day.IconPhrase}</div>
          </div>
        </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default Card;
