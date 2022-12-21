import React from 'react'
import { Marker, Popup  } from 'react-leaflet'

// Markers used to indicate events on the leaflet.js API map.
function EventMarker(props) {
  return (
    <Marker position={[props.event_lat, props.event_lon]}>
        <Popup>
            <p> {props.event_name}</p> <br />
            <p> {props.event_date}</p>
        </Popup>
    </Marker>
  )
}
export default EventMarker