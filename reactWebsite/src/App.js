import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import Footer from './Components/Footer';
import Signin from './Components/Signin/Signin';
import LandingPage from './Components/LandingPage';
import Home from './Components/Home';
import Register from './Components/Register';
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
          <Route exact path='/home' element={<Home />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
