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
              <hr/>
            </>
          )}
          <Routes>
            {!authenticated && <Route path="/" element={<Navigate to="/login" />} />}
            <Route path="/events" element={<EventList />} />
            <Route path="/selltickets" element={<SellTickets />} />
            <Route path="/ticketused" element={<TicketUsed />} />
            <Route path="/newevent" element={<NewEvent />} />
            <Route path="/tickettypes/:id" element={<TicketTypes />} />
            <Route path="/editevent/:id" element={<EditEvent />} />
            <Route path="/transaction/:id" element={<TransactionPage />} />
            <Route path="/eventreport/:id" element={<EventReport />} />
            <Route path="/login" element={<Login onAuthentication={handleAuthentication} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
