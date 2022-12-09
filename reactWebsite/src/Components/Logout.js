import React from 'react'

function Logout() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload()
    }

    return console.log("I did it")
}

export default Logout.handleLogout()