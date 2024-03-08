export async function getLocationWeather(lat, long) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1&timezone=America/Chicago`
    );
    const data = await res.json();

    const formattedData = [];
    for (let i = 0; i < data.hourly.time.length; i++) {
      const time = new Date(data.hourly.time[i]).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const temperature = data.hourly.temperature_2m[i];
      const roundedTemperature = Math.round(temperature);


      formattedData.push({ time, "temperature" : roundedTemperature+" F" });
    }
    return formattedData;
  } catch (e) {
    console.error(e);
  }
}

export async function getCityWeather(city) {
    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`)
        const data = await res.json()

        if (!data.hasOwnProperty('results')) {
            throw new Error('Invalid city name');
        }

        console.log(data)
        return getLocationWeather(data.results[0].latitude, data.results[0].longitude)

    }catch(e){
        console.error(e)
        throw e
    }
}
