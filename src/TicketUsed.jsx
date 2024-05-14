import React, { useState } from 'react';

function TicketUsed() {
    const [ticketCode, setTicketCode] = useState('');
    const [ticketInfo, setTicketInfo] = useState(null);

    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    const basicAuth = btoa(`${username}:${password}`);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const handleChange = (e) => {
        setTicketCode(e.target.value);
    };

    const handleSubmit = () => {
        fetch(`https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickets`, {
            headers: {
                Authorization: `Basic ${basicAuth}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tickets');
                }
                return response.json();
            })
            .then(data => {
                const foundTicket = data.find(ticket => ticket.ticketcode === ticketCode);
                if (foundTicket) {
                    setTicketInfo(foundTicket);
                } else {
                    setTicketInfo(null);
                    console.error('Ticket not found');
                }
            })
            .catch(error => {
                console.error('Error fetching tickets:', error);
            });
    };

    const markAsUsed = () => {
        fetch(`https://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickets/${ticketInfo.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${basicAuth}`
            },
            body: JSON.stringify({ used: new Date().toISOString() }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to mark ticket as used');
                }
                setTicketInfo({...ticketInfo, used: new Date().toISOString() });
            })
            .catch(error => {
                console.error('Error marking ticket as used:', error);
            });
    };

    return (
        <div>
            <h1>Check Ticket</h1>
            <input type="text" value={ticketCode} onChange={handleChange} />
            <button onClick={handleSubmit}>Search Ticket</button>
            {ticketInfo && (
                <div>
                    <h2>Ticket Details</h2>
                    <p>Ticket Code: {ticketInfo.ticketcode}</p>
                    <p>Event Name: {ticketInfo.ticketType.event.eventname}</p>
                    <p>Event Address: {ticketInfo.ticketType.event.address}</p>
                    <p>Show Time: {formatDate(ticketInfo.ticketType.event.showtime)}</p>
                    {ticketInfo.used ? (
                        <p>Marked as Used: {formatDate(ticketInfo.used)}</p>
                    ) : (
                        <button onClick={markAsUsed}>Mark as Used</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default TicketUsed;

