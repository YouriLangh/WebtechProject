import React, { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate} from 'react-router-dom'
import Sidenav from '../Sidenav/Sidenav'
import "./Home.css"

function Home() {
    const navigate = useNavigate()
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            console.log(token)
            const user = jwt.decode(token)
            if(!user) {
                localStorage.removeItem('token')
                navigate('/login', { replace: true })
                
             }
        } else { navigate('/login', { replace: true })}
    }, [])
    
  return (
    <div className='home_page'>
         <Sidenav/> 
    </div>
  )
}

export default Home