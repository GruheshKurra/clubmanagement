import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { supabase, testSupabaseConnection } from './supabaseClient';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import EventScheduling from './components/EventScheduling';
import CommunicationHub from './components/CommunicationHub';
import ClubDirectory from './components/ClubDirectory';
import RegistrationProcess from './components/RegistrationProcess';
import EventFeedback from './components/EventFeedback';
import AttendanceTracker from './components/AttendanceTracker';
import StudentDashboard from './components/StudentDashboard';
import Feedback from "./components/Feedback";
import AdminPage from "./components/AdminPage";
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Checking...');

  useEffect(() => {
    async function checkConnection() {
      const isConnected = await testSupabaseConnection();
      setConnectionStatus(isConnected ? 'Connected successfully' : 'Connection failed');
    }
    checkConnection();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar supabase={supabase} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AnimatedRoutes />
        </main>
        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Home supabase={supabase} />} />
          <Route path="/events" element={<EventList supabase={supabase} />} />
          <Route path="/event/:id" element={<EventDetails supabase={supabase} />} />
          <Route path="/event-scheduling" element={<EventScheduling supabase={supabase} />} />
          <Route path="/communication-hub" element={<CommunicationHub supabase={supabase} />} />
          <Route path="/club-directory" element={<ClubDirectory supabase={supabase} />} />
          <Route path="/registration" element={<RegistrationProcess supabase={supabase} />} />
          <Route path="/event-feedback" element={<EventFeedback supabase={supabase} />} />
          <Route path="/attendance" element={<AttendanceTracker supabase={supabase} />} />
          <Route path="/dashboard" element={<StudentDashboard supabase={supabase} />} />
          <Route path="/feedback" element={<Feedback supabase={supabase} />} />
          <Route path="/admin" element={<AdminPage supabase={supabase} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;