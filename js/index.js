document.addEventListener("DOMContentLoaded", (event) => {
    const weatherContainer = document.getElementById("weather-container");
    const wfoCode = 'SGX';
    const gridpoints = `57,14`; // gridpoints for la jolla

    const apiUrl = `https://api.weather.gov/gridpoints/${wfoCode}/${gridpoints}/forecast/hourly`;
    let curConditions = fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Current period based on the current time
            const currentDate = new Date();
            const currentPeriod = data.properties.periods.find(period => {
                const periodStartTime = new Date(period.startTime);
                const periodEndTime = new Date(period.endTime);
                return currentDate >= periodStartTime && currentDate < periodEndTime;
            });
            console.log('Current Weather Conditions:', currentPeriod);
            return currentPeriod;
        })
        .catch(error => {
            console.error('Fetch error:', error);
            weatherContainer.innerHTML = `${error}`;
        });

    curConditions.then(currentPeriod => {
        if (currentPeriod) {
            let iconURL = currentPeriod.icon.split(',')[0];
            weatherContainer.innerHTML = `<img src="${iconURL}" id="icon">
                                          <span id="forecast">${currentPeriod.shortForecast}</span>
                                          <p>
                                            <span>Temperature: ${currentPeriod.temperature}</span>
                                            <span>&deg${currentPeriod.temperatureUnit}</span>
                                          </p>
                                          <p>
                                            <span>Wind speed:</span>
                                            <span>${currentPeriod.windSpeed}</span>
                                          </p>
                                            <span>Wind direction:</span>
                                            <span>${currentPeriod.windDirection}</span>
                                          <p>
                                          <p>
                                            <span>Humidity: </span>
                                            <span>${currentPeriod.relativeHumidity.value}%</span>
                                          </p>
                                          <p>
                                            <span>Probability of Precipitation: </span>
                                            <span>${currentPeriod.probabilityOfPrecipitation.value}%</span>
                                          </p>
                                          `;
        } else {
            const error = "No current weather data available.";
            console.error(error);
            weatherContainer.innerHTML = `<p>${error}</p>`
        }
    });
});