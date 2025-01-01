import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DocumentEditor from './components/DocumentEditor';
import DocumentForm from './components/DocumentForm';
import './App.css';
import { LayoutProvider, useLayout } from './contexts/LayoutContext';

const AppContent = () => {
    const { showFooter } = useLayout();
    
    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/documents/new" element={<DocumentForm />} />
                    <Route path="/documents/:id" element={<DocumentEditor />} />
                </Routes>
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <LayoutProvider>
                <AppContent />
            </LayoutProvider>
        </Router>
    );
};

export default App;