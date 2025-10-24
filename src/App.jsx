import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { CoinProvider } from './contexts/CoinContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import LevelDetail from './pages/LevelDetail';
import Wallet from './pages/Wallet';
import Referral from './pages/Referral';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <CoinProvider>
          <Router>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/learning-path" element={<LearningPath />} />
                  <Route path="/level/:id" element={<LevelDetail />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/referral" element={<Referral />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CoinProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
