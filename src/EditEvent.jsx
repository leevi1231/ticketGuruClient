import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    const basicAuth = btoa(`${username}:${password}`);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/event/${id}`, {
                    headers: {
                        Authorization: `Basic ${basicAuth}`
                    }
                });
                setEvent(response.data);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/event/${id}`, event, {
                headers: {
                    Authorization: `Basic ${basicAuth}`
                }
            });
            window.location.href = '/events';
        } catch (error) {
            setError(error.message);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
            <h2>Edit Event</h2>
            <form onSubmit={handleFormSubmit}>
                <div>
                <label>Event Name:</label>
                <input type="text" value={event.eventname} onChange={(e) => setEvent({ ...event, eventname: e.target.value })} />
                </div>
                <div>
                <label>Address:</label>
                <input type="text" value={event.address} onChange={(e) => setEvent({ ...event, address: e.target.value })} />
                </div>
                <div>
                <label>Showtime:</label>
                <input type="datetime-local" value={event.showtime} onChange={(e) => setEvent({ ...event, showtime: e.target.value })} />
                </div>
                <div>
                <label>Description:</label>
                <input value={event.description} onChange={(e) => setEvent({ ...event, description: e.target.value })} />
                </div>
                <div>
                <label>Max Tickets:</label>
                <input type="number" value={event.maxtickets} onChange={(e) => setEvent({ ...event, maxtickets: parseInt(e.target.value) })} />
                </div>
                <div>
                <label>Duration:</label>
                <input type="number" value={event.duration} onChange={(e) => setEvent({ ...event, duration: parseInt(e.target.value) })} />
                </div>
                <button class="addbutton" type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditEvent;
