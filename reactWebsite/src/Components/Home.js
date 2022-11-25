import React, { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate} from 'react-router-dom'

function Home() {
    const navigate = useNavigate()
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload()
    }

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
    <div>
        <div>Home</div>
        <button onClick={() => handleLogout()} >Logout</button>
    </div>
  )
}

export default Home