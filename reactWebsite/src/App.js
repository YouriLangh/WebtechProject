import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import Footer from './Components/Footer/Footer';
import Signin from './Components/Login/Signin';
import LandingPage from './Components/Landingpage/LandingPage';
import Home from './Components/Home/Home';
 import Register from './Components/Register/Register';
 import Map from './Components/Mappage/Map'
import { 
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";



function App() {
  return (
    <div className="App">
       <Router>
        <Routes>
          <Route exact path='/' element={<LandingPage/>} />
          <Route exact path='/register' element={<Register/>} />
          <Route exact path='/login' element={<Signin />} />
          <Route exact path='/app/home' element={<Home />} />
          <Route exact path='/app/profile' element={<Map />} />
          <Route exact path='/app/events' element={<Map />} />
          <Route exact path='/app/search' element={<Map />} />
          <Route exact path='/app/map' element={<Map />} />
          <Route exact path='/app/settings' element={<Map />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
