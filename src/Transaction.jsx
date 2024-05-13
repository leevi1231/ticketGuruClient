import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TransactionPage = () => {
    const [transaction, setTransaction] = useState(null);
    const [tickets, setTickets] = useState([]);
    const { id } = useParams();

    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    const basicAuth = btoa(`${username}:${password}`);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const generateRandomQRCode = () => {
        const randomContent = Math.random().toString(36).substring(7);
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${randomContent}`;
    };

    const handlePrintTicket = (ticket) => {
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head>
                    <title>Ticket Information</title>
                    <style>
                        .ticket-info {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            border: 1px solid #ccc;
                        }
                    </style>
                </head>
                <body>
                    <div class="ticket-info">
                        <h2>Ticket Information</h2>
                        <p>Ticket Type: ${ticket.ticketType.tickettypename}</p>
                        <p>Ticket Code: ${ticket.ticketcode}</p>
                        <p>Event: ${ticket.ticketType.event.eventname}</p>
                        <p>Address: ${ticket.ticketType.event.address}</p>
                        <p>Showtime: ${formatDate(ticket.ticketType.event.showtime)}</p>
                        <p>QR Code:</p>
                        <div id="qr-code"></div>
                    </div>
                    <script>
                        function printAfterQRCodeLoad() {
                            window.print();
                        }
                        const qrCodeImg = new Image();
                        qrCodeImg.onload = printAfterQRCodeLoad;
                        qrCodeImg.src = "${generateRandomQRCode()}";
                        document.getElementById('qr-code').appendChild(qrCodeImg);
                    </script>
                </body>
            </html>
        `;
        printWindow.document.write(content);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionResponse = await axios.get(`http://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/transactions/${id}`, {
                    headers: {
                        Authorization: `Basic ${basicAuth}`
                    }
                });
                setTransaction(transactionResponse.data);

                const ticketsResponse = await axios.get('http://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickets', {
                    headers: {
                        Authorization: `Basic ${basicAuth}`
                    }
                });
                setTickets(ticketsResponse.data.filter(ticket => ticket.transaction.id === parseInt(id)));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, basicAuth]);

    if (!transaction) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <style>
                {`
                table {
                    width: 70%;
                }
                `}
            </style>
            <h2>Transaction Complete</h2>
            <p>ID: {id}</p>
            <p>Date: {formatDate(transaction.transactiondate)}</p>
            <p>Total: <b>{transaction.ticketsum}€</b></p>
            <h2>Tickets sold:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Ticket Type</th>
                        <th>Ticket Code</th>
                        <th>Event</th>
                        <th>Address</th>
                        <th>Showtime</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket.id}>
                            <td>{ticket.ticketType.tickettypename}</td>
                            <td>{ticket.ticketcode}</td>
                            <td>{ticket.ticketType.event.eventname}</td>
                            <td>{ticket.ticketType.event.address}</td>
                            <td>{formatDate(ticket.ticketType.event.showtime)}</td>
                            <td><button onClick={() => handlePrintTicket(ticket)}>Print</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionPage;
