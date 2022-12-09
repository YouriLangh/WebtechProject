import React from 'react'
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import './Map.css'
import Sidenav from '../Sidenav/Sidenav'
import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate} from 'react-router-dom'

function Map() {

  const navigate = useNavigate()
    
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


  return (
    <div className='map_page'>

    <div id='map_container'>
<MapContainer center={[50.85, 4.35]} zoom={13} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[51.505, -0.09]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>
</div>
<Sidenav/>

</div>
  )
}

export default Map