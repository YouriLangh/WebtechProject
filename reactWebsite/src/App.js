import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import Signin from './Components/Login/Signin';
import LandingPage from './Components/Landingpage/LandingPage';
import Home from './Components/Home/Home';
 import Register from './Components/Register/Register';
 import Map from './Components/Mappage/Map'
import Profile from './Components/Profile/Profile';
import Weather from './Components/Weather/Weather'
import Users from './Components/Users/Users'
import { 
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Creator from "./Components/Creator/Creator";
import Activity from "./Components/Activity/Activity";
import Sidenav from './Components/Sidenav/Sidenav';
import { useState } from 'react';
import OtherUser from './Components/OtherUser/OtherUser';
import {fetchActivities} from "./Components/Activity/ActivityService";

function App() {
  let aDate = new Date("2022-12-19 13:00:00")
  // The pseudoData gets passed to sidenav to show no updates have been done to it
  const [pseudoData, setPseudoData] = useState({username: '', url:''})
  // A single navbar used for whole website.
  let sidenav = <Sidenav newData= {pseudoData}/>


  // Used by profile component to update the navbar
  const updateData = (data) => {
    setPseudoData(data)
  }

  return (
    <div className="App">
       <Router>
        <Routes>
          {/* All routes before signing in */}
          <Route exact path='/' element={<LandingPage/>} />
          <Route exact path='/register' element={<Register/>} />
          <Route exact path='/login' element={<Signin />} />

          {/* All routes after signing in */}
          <Route exact path='/app/home' element={<div><Home /> {sidenav} </div>} />
          <Route exact path='/app/profile' element={<div><Profile updateCallback={updateData}/> {sidenav} </div>} />
          <Route exact path='/app/events' element={<div><Activity /> {sidenav} </div>} />
          <Route exact path='/app/events/create' element={<div><Creator /> {sidenav} </div>} />
          <Route exact path='/app/map' element={<div><Map /> {sidenav} </div>} />
          <Route exact path='/app/settings' element={<div><Map /> {sidenav} </div>} />
          <Route exact path='/app/users' element={<div><Users /> {sidenav} </div>} />
          <Route exact path='/app/users/:id' element={<div><OtherUser /> {sidenav} </div>} />
          <Route exact path='/app/weather' element={<Weather eventLat="50.8833" eventLon="4.5" eventDate= {aDate} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
