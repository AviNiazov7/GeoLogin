
import './App.css';
import DialogLogin from './COMPONENTS/DialogLogin';
import Home from './COMPONENTS/Home';
import SignupDialog from './COMPONENTS/SignupDialog';
import { AuthProvider } from './Contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <div >
     

     <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupDialog isOpen={true} onClose={() => {}} />} />
          <Route path="/login" element={<DialogLogin isOpen={true} onClose={() => {}} />} /> 
        </Routes>
      </Router>
     </AuthProvider>
    
    </div>
  );
}

export default App;
