import "./App.css";
import LoginPage from "./Components/LoginPage";
import WelcomePage from "./Components/WelcomePage";
import SignUpPage from "./Components/SignUpPage";

import {BrowserRouter, Routes, Route } from 'react-router-dom'
import EmailVerification from "./Components/EmailVerification";
import HomePage from "./Components/HomePage";
import Layout from "./Navbar/Navbar";
import EntryPage from "./Components/EntryPage";
import HistoryPage from "./Components/HistoryPage";
import KarjaPage from "./Components/KarjaPage";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<WelcomePage/>}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/signup" element={<SignUpPage />}/>
      <Route path="/verify-email/:token" element={<EmailVerification />} />
      {/* <Route path="homepage" element={<HomePage/>}/> */}
      <Route path="/dashboard" element={<Layout/>}> 
      <Route index element={<HomePage />} />
      <Route path="entry" element={<EntryPage />}/>
      <Route path="history" element={<HistoryPage />}/>
      <Route path="karja" element={<KarjaPage/>}/>
       </Route>
      
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
