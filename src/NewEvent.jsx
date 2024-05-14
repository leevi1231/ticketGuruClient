import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NewEvent() {
  const [eventname, setEventname] = useState('');
  const [address, setAddress] = useState('');
  const [showtime, setShowtime] = useState('');
  const [description, setDescription] = useState('');
  const [maxtickets, setMaxtickets] = useState('');
  const [duration, setDuration] = useState('');
  const navigate = useNavigate();

  const username = localStorage.getItem('username') || '';
  const password = localStorage.getItem('password') || '';
  const basicAuth = btoa(`${username}:${password}`);

  const handleNewEvent = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/events',
        {
          eventname,
          address,
          showtime,
          description,
          maxtickets,
          duration
        },
        {
          headers: {
            Authorization: `Basic ${basicAuth}`
          }
        }
      );

      navigate('/events');
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };

  return (
    <div>
      <style>
        {`
                table {
                    width: 50%;
                }

                form div {
                    width: 15%;
                    margin: auto;
                    padding: 5px;
                }

                label {
                    display: block;
                    text-align: left;
                }

                input {
                    width: 100%;
                }
            `}
      </style>
      <h2>Add new event</h2>
      <form onSubmit={handleNewEvent}>
        <div>
          <label>Event name:</label>
          <input
            type="text"
            value={eventname}
            onChange={(e) => setEventname(e.target.value)}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Date & Time:</label>
          <input
            type="datetime-local"
            value={showtime}
            onChange={(e) => setShowtime(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Max tickets:</label>
          <input
            type="number"
            value={maxtickets}
            onChange={(e) => setMaxtickets(e.target.value)}
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <button className="addbutton" type="submit">Add event</button>
      </form>
    </div>
  );
}
