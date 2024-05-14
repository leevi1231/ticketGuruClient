// EventList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import EventReport from './EventReport'; // Import the new component

const EventList = () => {
    const [eventsWithTicketTypes, setEventsWithTicketTypes] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    const basicAuth = btoa(`${username}:${password}`);
    const navigate = useNavigate(); // Get the navigate function

    useEffect(() => {
        const fetchData = () => {
            Promise.all([
                fetch('https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/events', {
                    headers: {
                        Authorization: `Basic ${basicAuth}`
                    }
                }),
                fetch('https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickettypes', {
                    headers: {
                        Authorization: `Basic ${basicAuth}`
                    }
                })
            ])
                .then(([eventsResponse, ticketTypesResponse]) => {
                    if (!eventsResponse.ok || !ticketTypesResponse.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    return Promise.all([eventsResponse.json(), ticketTypesResponse.json()]);
                })
                .then(([eventsData, ticketTypesData]) => {
                    const eventsWithTypes = eventsData.map(event => ({
                        ...event,
                        ticketTypes: ticketTypesData.filter(ticket => ticket.event.id === event.id)
                    }));
                    setEventsWithTicketTypes(eventsWithTypes);
                    setIsLoading(false);
                })
                .catch(error => {
                    setError(error.message);
                    setIsLoading(false);
                });
        };

        fetchData();
    }, []);

    const handleDeleteEvent = (eventId) => {
        axios.delete(`https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/event/${eventId}`, {
            headers: {
                Authorization: `Basic ${basicAuth}`
            }
        })
            .then(() => {
                setEventsWithTicketTypes(events => events.filter(event => event.id !== eventId));
            })
            .catch(error => {
                setError(error.message);
            });
    };

    const handleEditEvent = (eventId) => {
        navigate(`/editevent/${eventId}`);
    };

    const handleEventReport = (eventId) => {
        navigate(`/eventreport/${eventId}`); // Navigate to the event report page
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Events</h1>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Event Name</th>
                        <th>Address</th>
                        <th>Showtime</th>
                        <th>Description</th>
                        <th>Max Tickets</th>
                        <th>Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {eventsWithTicketTypes.map((event, index) => (
                        <tr key={event.id}>
                            <td>{index + 1}</td>
                            <td>{event.eventname}</td>
                            <td>{event.address}</td>
                            <td>{new Date(event.showtime).toLocaleString()}</td>
                            <td>{event.description}</td>
                            <td>{event.maxtickets}</td>
                            <td>{event.duration} min</td>
                            <td>
                                <button onClick={() => handleEditEvent(event.id)}>Edit</button>
                                <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                                <button onClick={() => navigate(`/tickettypes/${event.id}`)}>Ticket Types</button>
                                <button onClick={() => handleEventReport(event.id)}>Sales Report</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="addbutton" onClick={() => navigate('/newevent')}>Add new event</button>{' '}
        </div>
    );
};

export default EventList;
