import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import './Map.css'
import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate} from 'react-router-dom'
import axios from 'axios'
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from 'leaflet';
import {Control} from "leaflet/src/control";

// The map component shows all events on the map 
function Map() {

    const navigate = useNavigate()
    // const [activityList, setActivityList] = useState([{event_lat: 0, event_lon: 0, event_name:'', event_date:""}])

    const [markers, setMarkers] = useState([])
    const [notLoadedMarkers, setNotLoadedMarkers] = useState(true);
    let geocoder = new L.Control.Geocoder.Nominatim();
    const[allLoaded, setAllLoaded] = useState(false)


    // Check if the user is logged in (cookie did not get deleted from storage)
    // The token logged is a jwt Token holding the username and email of the user
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt.decode(token)
            if (!user) {
                localStorage.removeItem('token')
                navigate('/login', {replace: true})

                // Get all the activities from the database 
            } else if (notLoadedMarkers) {
                try {
                    axios.get('http://localhost:4000/app/map').then(res => {
                        console.log("res fetch", res)
                            res.data.activities.map(act => geocoder.geocode(act.activityLocation, function (results) {
                                if(results && results.length > 0){
                                    console.log("res", results)
                                console.log(results[0].center.lat)
                                setMarkers(oldArray => [...oldArray, ({activityName: act.activityName, activityDate: act.activityDate, lat: results[0].center.lat, lon: results[0].center.lng})])
                    }}))
                    setAllLoaded(true);
                        }
                    )
                } catch (error) {
                    console.log(error);
                }
            }

        } else {
            navigate('/login', {replace: true})
        }
    }, [])


    useEffect(() => {
        console.log(markers)
    },[markers])


        return (
            <div className='map_page'>
                <div id='map_container'>
                    <MapContainer className='custom-popup' center={[50.85, 4.35]} zoom={13} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        {/* For each event, add a marker and pop up with the info of that event */}
                        {markers.length > 0  && allLoaded ? markers.map(eventInfo =>
                            <Marker key={eventInfo.lat + eventInfo.lon / markers.indexOf(eventInfo)} position={eventInfo}>
                                <Popup>
                                    {eventInfo.activityName} 
                                    {eventInfo.activityDate}
                                </Popup>
                            </Marker>
                        ) : ''}
                    </MapContainer>
                </div>
            </div>
        )
    }

export default Map