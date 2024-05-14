import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TicketTypesForEvent = () => {
    const { id } = useParams();
    const [ticketTypes, setTicketTypes] = useState([]);
    const [newTicketType, setNewTicketType] = useState({ tickettypename: '', price: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    const basicAuth = btoa(`${username}:${password}`);

    useEffect(() => {
        const fetchTicketTypes = async () => {
            try {
                const response = await axios.get(`https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickettypes`, {
                    headers: {
                        Authorization: `Basic ${basicAuth}`
                    }
                });
                setTicketTypes(response.data);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchTicketTypes();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickettypes`, {
                ...newTicketType,
                event: {
                    id: parseInt(id)
                }
            }, {
                headers: {
                    Authorization: `Basic ${basicAuth}`
                }
            });
            setTicketTypes([...ticketTypes, response.data]);
            setNewTicketType({ tickettypename: '', price: '' });
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (ticketTypeId) => {
        try {
            await axios.delete(`http://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickettype/${ticketTypeId}`, {
                headers: {
                    Authorization: `Basic ${basicAuth}`
                }
            });
            setTicketTypes(ticketTypes.filter(ticketType => ticketType.id !== ticketTypeId));
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
            <h2>Ticket Types for Event ID: {id}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketTypes.map(ticketType => {
                        if (ticketType.event.id === parseInt(id)) {
                            return (
                                <tr key={ticketType.id}>
                                    <td>{ticketType.tickettypename}</td>
                                    <td>{ticketType.price} €</td>
                                    <td>
                                        <button onClick={() => handleDelete(ticketType.id)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        }
                        return null;
                    })}
                </tbody>
            </table>
            <h3>Add New Ticket Type</h3>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Description:</label>
                    <input type="text" value={newTicketType.tickettypename} onChange={(e) => setNewTicketType({ ...newTicketType, tickettypename: e.target.value })} />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" value={newTicketType.price} onChange={(e) => setNewTicketType({ ...newTicketType, price: e.target.value })} />
                </div>
                <button class="addbutton" type="submit">Add Ticket Type</button>
            </form>
        </div>
    );
};

export default TicketTypesForEvent;
