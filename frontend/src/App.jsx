import React, { useState } from "react";
import axios from "axios";

import Home from "./pages/Home";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


const App = () => {
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [error, setError] = useState(null);

  const fetchPastWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwttoken')}` }
      });
      setPastWorkouts(response.data || []);
      setError(null);
    } catch (error) {
      setPastWorkouts([]);
      setError('Error fetching workouts');
      console.error('Error fetching past workouts:', error);
    }
  };

  return (
    <div>
      
      <div className="max-w-[90vw] m-auto ">
        <Navbar />
        <Home />
      </div>
      <Footer  />
    </div>
  );
};

export default App;
