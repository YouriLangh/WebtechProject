import React, { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory} from 'react-router-dom'

function Home() {
    const history = useHistory()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt.decode(token)
            if(!user) {
                localStorage.removeItem('token')
                history.replace('/login')
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