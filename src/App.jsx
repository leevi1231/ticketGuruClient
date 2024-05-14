import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import SellTickets from './SellTickets';
import EventList from './EventList';
import TicketUsed from './TicketUsed';
import Login from './Login';
import NewEvent from './NewEvent';
import TicketTypes from './TicketTypes';
import EditEvent from './EditEvent';
import TransactionPage from './Transaction';
import EventReport from './EventReport';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('authenticated');
    if (storedAuth) {
      setAuthenticated(JSON.parse(storedAuth));
    }
  }, []);

  const handleAuthentication = (isAuthenticated) => {
    setAuthenticated(isAuthenticated);
    sessionStorage.setItem('authenticated', JSON.stringify(isAuthenticated));
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('authenticated');
  };

  const ProtectedRoute = ({ children }) => {
    return authenticated ? children : <Navigate to="/" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          {authenticated && (
            <>
              <Link to="/events">Events</Link>{' '}
              <Link to="/selltickets">Sell Tickets</Link>{' '}
              <Link to="/ticketused">Check Ticket</Link>{' '}
              <Link to="/login" onClick={handleLogout}>Logout</Link>{' '}
              <hr />
            </>
          )}
          <Routes>
            <Route path="/login" element={<Login onAuthentication={handleAuthentication} />} />
            <Route path="/" element={<Navigate to={authenticated ? "/events" : "/login"} />} />
            <Route path="/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
            <Route path="/selltickets" element={<ProtectedRoute><SellTickets /></ProtectedRoute>} />
            <Route path="/ticketused" element={<ProtectedRoute><TicketUsed /></ProtectedRoute>} />
            <Route path="/newevent" element={<ProtectedRoute><NewEvent /></ProtectedRoute>} />
            <Route path="/tickettypes/:id" element={<ProtectedRoute><TicketTypes /></ProtectedRoute>} />
            <Route path="/editevent/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
            <Route path="/transaction/:id" element={<ProtectedRoute><TransactionPage /></ProtectedRoute>} />
            <Route path="/eventreport/:id" element={<ProtectedRoute><EventReport /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
