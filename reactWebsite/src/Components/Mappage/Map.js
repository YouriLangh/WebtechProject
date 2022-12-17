import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import './Map.css'
import Sidenav from '../Sidenav/Sidenav'
import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate} from 'react-router-dom'
import axios from 'axios'

function Map() {

  const navigate = useNavigate()
  // const [activityList, setActivityList] = useState([{event_lat: 0, event_lon: 0, event_name:'', event_date:""}])
    
  const [markers, setMarkers] = useState([])
    // useEffect(() => {
    //     const token = localStorage.getItem('token')
    //     if (token) {
    //         console.log(token)
    //         const user = jwt.decode(token)
    //         if(!user) {
    //             localStorage.removeItem('token')
    //             navigate('/login', { replace: true })
                
    //          }
    //     } else { navigate('/login', { replace: true })}
    // }, [])

    useEffect(() => {
      axios.get('http://localhost:4000/app/map').then((res) => {
        if (res.status === 200){
          setMarkers(res.data)
        }})
    }, [])

    let pseudoData = {username: '', url:''}
  return (
    <div className='map_page'>

    <div id='map_container'>
<MapContainer center={[50.85, 4.35]} zoom={13} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
   {markers.length > 0 ? markers.map(eventInfo => 
   <Marker position={[eventInfo.lat, eventInfo.lon]}>
   <Popup>
       <p> {eventInfo.activityName}</p> <br />
       <p> {eventInfo.date}</p>
   </Popup>
</Marker>
   ) : '' } 
</MapContainer>
</div>
 <Sidenav newData={pseudoData}/> 

</div>
  )
}

export default Map