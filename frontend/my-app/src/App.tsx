
import './App.css';
import Home from './COMPONENTS/Home';
import { AuthProvider } from './Contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <div >
     

     <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        
        </Routes>
      </Router>
     </AuthProvider>
    
    </div>
  );
}

export default App;
