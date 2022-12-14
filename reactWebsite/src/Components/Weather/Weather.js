import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./Weather.css"

// Hide API key.
const api = {
    key: 'd4f6019e47c4d4f2b6f97ec23f5a34fa',
    base: "https://api.openweathermap.org/data/2.5"
};

// Made by Youri
function Weather(props) {
  // Initialize the weather as -100°C, this is done to give a certain -inf. value on initialisation
    const [weather, setWeather] = useState(-100)
    // the image gets fetched from the weather API.
    const [imgUrl, setImgUrl] = useState("")

    // get the forecast from a certain location (this return the weather every 3H, until 5 days in advance)
    // Thus we can only display the weather if the event happens within 5 days
    const getWeather = () => {
       axios.get(`${api.base}/forecast?lat=${props.eventLat}&lon=${props.eventLon}&appid=${api.key}&units=metric`)
        .then((weatherData) => getIconAndTemp(weatherData))
    }


    // This will return the forecast that is closest to that of the event and also fetches the correct icon
    const getIconAndTemp = (weatherData) => {
      var idx = findClosest(weatherData.data.list)
      setWeather(weatherData.data.list[idx].main.temp.toFixed(1))
      setImgUrl("http://openweathermap.org/img/wn/" + weatherData.data.list[idx].weather[0].icon+ "@2x.png")
    }

    useEffect(() => {
      // If the event happens within 5 days, get the weather
      //5 days in milliseconds (minus 3h)
      if(Math.abs(props.eventDate - Date.now()) < 421200000)
      getWeather()
    }, [])

    // A search function to find the weather closest to a certain hour/day
     const findClosest = (weatherArray) => {
       var arrayLength = weatherArray.length
       var closestDate = new Date("1970-1-1")
       var closestIdx = 0
       for (var i = 0; i < arrayLength; i++){
        var weatherDate = new Date(weatherArray[i].dt_txt)
          if (Math.abs(props.eventDate - weatherDate) < Math.abs(props.eventDate - closestDate)){
             closestDate = weatherDate
             closestIdx = i
        }
      }
       return closestIdx
     }

    let content

    // If we have found one, return the correct icon and temperature
    if(weather > -100){
      content = <div className='weather_display'>
        <div className='weather_image'> <img src={imgUrl} alt='weather_icon'/></div>
        <p>{weather}°C</p>
         </div>
    } else {
      content = <div></div>
    }
   

  return (
    <div> 
      {content}
    </div>
  )
}

export default Weather