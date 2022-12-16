import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import Footer from './Components/Footer/Footer';
import Signin from './Components/Login/Signin';
import LandingPage from './Components/Landingpage/LandingPage';
import Home from './Components/Home/Home';
 import Register from './Components/Register/Register';
 import Map from './Components/Mappage/Map'
import Profile from './Components/Profile/Profile';
import Weather from './Components/Weather/Weather'
import { 
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Creator from "./Components/Creator/Creator";
import Activity from "./Components/Activity/Activity";
import {fetchActivities} from "./Components/Activity/ActivityService";

 //  lat=50.8833&lon=4.5

function App() {
  let aDate = new Date("2022-12-17 23:00:00")
  return (
    <div className="App">
       <Router>
        <Routes>
          <Route exact path='/' element={<LandingPage/>} />
          <Route exact path='/register' element={<Register/>} />
          <Route exact path='/login' element={<Signin />} />
          <Route exact path='/app/home' element={<Home />} />
          <Route exact path='/app/profile' element={<Profile />} />
          <Route exact path='/app/events' element={<Activity />} />
          <Route exact path='/app/events/create' element={<Creator />} />
          <Route exact path='/app/search' element={<Map />} />
          <Route exact path='/app/map' element={<Map />} />
          <Route exact path='/app/settings' element={<Map />} />
          <Route exact path='/app/weather' element={<Weather eventLat="50.8833" eventLon="4.5" eventDate= {aDate} />} />
          <Route exact path='/home' element={<Home />} />
          <Route exact path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
