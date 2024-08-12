import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Home } from './pages/home';
import Host from './pages/host';
import AttendedMeetings from './pages/attended_meeting';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/host' element={<Host/>}/>
          <Route path='/attendedmeeting' element={<AttendedMeetings/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
