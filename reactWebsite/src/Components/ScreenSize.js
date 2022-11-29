import React, {useEffect, useState} from 'react'

function ScreenSize() {
    const [windowDimension, detectHW] = useState({winWidth: window.innerWidth, winHeight: window.innerHeight})

    const detectSize = () => {
        detectHW({
            winWidth: window.innerWidth,
            winHeight: window.innerHeight
        })
    }
        useEffect(() => {
            window.addEventListener('resize', detectSize)
            return() => {
                window.removeEventListener('resize', detectSize)
            }
        }, [windowDimension])
  return (
    <div>ScreenSize</div>
  )
}

export default ScreenSize