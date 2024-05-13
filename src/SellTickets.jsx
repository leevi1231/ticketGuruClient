import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SellTickets = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [ticketTypes, setTicketTypes] = useState([]);
    const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [shoppingCart, setShoppingCart] = useState([]);
    const [filteredTicketTypes, setFilteredTicketTypes] = useState([]);
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    const basicAuth = btoa(`${username}:${password}`);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/events', {
                    headers: {
                        Authorization: `Basic ${basicAuth}`
                    }
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [basicAuth]);

    useEffect(() => {
        if (selectedEvent) {
            const fetchTicketTypes = async () => {
                try {
                    const response = await axios.get(`http://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickettypes?eventId=${selectedEvent}`, {
                        headers: {
                            Authorization: `Basic ${basicAuth}`
                        }
                    });
                    setTicketTypes(response.data);
                } catch (error) {
                    console.error('Error fetching ticket types:', error);
                }
            };

            fetchTicketTypes();
        }
    }, [selectedEvent, basicAuth]);

    useEffect(() => {
        if (selectedEvent) {
            const filteredTypes = ticketTypes.filter((type) => type.event.id === parseInt(selectedEvent));
            setFilteredTicketTypes(filteredTypes);
        } else {
            setFilteredTicketTypes([]);
        }
    }, [selectedEvent, ticketTypes]);

    const handleEventChange = (event) => {
        setSelectedEvent(event.target.value);
        setSelectedTicketTypeId(null);
    };

    const handleTicketTypeChange = (event) => {
        const selectedId = parseInt(event.target.value);
        setSelectedTicketTypeId(selectedId);
    };

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity(newQuantity);
    };

    const addToCart = (event) => {
        event.preventDefault();
        const selectedTicket = ticketTypes.find((type) => type.id === selectedTicketTypeId);
        if (selectedTicket) {
            const itemsToAdd = Array.from({ length: quantity }, () => selectedTicket);
            setShoppingCart((prevCart) => [...prevCart, ...itemsToAdd]);
            setSelectedTicketTypeId(null);
            setQuantity(1);
        }
    };

    const currentDate = new Date().toISOString();
    const totalPrice = shoppingCart.reduce((total, item) => total + item.price, 0);

    const handleConfirmTransaction = async () => {
        try {
            const transactionResponse = await axios.post('http://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/transactions', {
                transactiondate: currentDate,
                ticketsum: totalPrice
            }, {
                headers: {
                    Authorization: `Basic ${basicAuth}`
                }
            });

            const transactionId = transactionResponse.data.id;
            const ticketTypeIds = shoppingCart.map(item => item.id);

            for (const ticketTypeId of ticketTypeIds) {
                await axios.post(
                    'http://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickets',
                    {
                        transaction: { id: transactionId },
                        ticketType: { id: ticketTypeId }
                    },
                    {
                        headers: {
                            Authorization: `Basic ${basicAuth}`
                        }
                    }
                );
            }

            navigate(`/transaction/${transactionId}`);
        } catch (error) {
            console.error('Error confirming transaction:', error);
            alert('An error occurred while confirming the transaction.');
        }
    };

    return (
        <div>
            <style>
                {`
                table {
                    width: 50%;
                    margin: 0 auto;
                }
    
                form div {
                    width: 23%;
                    padding: 13px;
                    margin-left: 10px;
                    margin-right: 10px;
                    display: inline-block;
                }
    
                label {
                    display: block;
                    text-align: left;
                }
    
                form select {
                    width: 100%;
                }

                form input {
                    width: calc(100% - 10px);
                }
    
                .total {
                    margin-top: 20px;
                }
    
                .total p {
                    display: inline-block;
                }
    
                .total button {
                    margin-left: 10px;
                }
                `}
            </style>
            <h1>Sell Tickets</h1>
            <form onSubmit={addToCart}>
                <div class="formcontainer">
                    <div>
                        <label>Select an event:</label>
                        <select value={selectedEvent} onChange={handleEventChange}>
                            <option value="">-- Events --</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.eventname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Select ticket type:</label>
                        <select value={selectedTicketTypeId} onChange={handleTicketTypeChange}>
                            <option value="">-- Ticket Types --</option>
                            {filteredTicketTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.tickettypename} - {type.price} €
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Amount of tickets:</label>
                        <input type="number" value={quantity} onChange={handleQuantityChange} min="1" />
                    </div>
                </div>
                <br />
                <button type="submit" disabled={!selectedTicketTypeId}>
                    Add to Cart
                </button>
            </form>

            <div>
                <h2>Shopping Cart</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Ticket Type</th>
                            <th>Event</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shoppingCart.map((item, index) => (
                            <tr key={index}>
                                <td>{item.tickettypename}</td>
                                <td>{item.event.eventname}</td>
                                <td>{item.price} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="total">
                <p>Total Price: <b>{totalPrice} €</b></p><button onClick={handleConfirmTransaction} disabled={shoppingCart.length === 0}>Confirm transaction</button>
            </div>
        </div>
    );
};

export default SellTickets;
