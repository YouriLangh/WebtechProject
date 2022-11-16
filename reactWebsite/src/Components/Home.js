import React, { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate} from 'react-router-dom'

function Home() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt.decode(token)
            if(!user) {
                localStorage.removeItem('token')
                navigate('/login', { replace: true })
            } else {
                //  show home
                 
            }
        }
    }, [])
  return (
    <div>Home</div>
  )
}

export default Home