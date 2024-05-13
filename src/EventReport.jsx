import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventReport = () => {
    const [ticketSales, setTicketSales] = useState([]);
    const [totalSales, setTotalSales] = useState({ totalAmount: 0, totalCount: 0 });
    const [eventName, setEventName] = useState('');
    const { id } = useParams();

    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    const basicAuth = btoa(`${username}:${password}`);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/event/${id}`, {
                    headers: {
                        Authorization: `Basic ${basicAuth}`
                    }
                });
                setEventName(response.data.eventname);
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchEventDetails();
    }, [id, basicAuth]);

    useEffect(() => {
        const fetchTicketSales = async () => {
            try {
                const response = await axios.get(`http://ohjelmistoprojekti1-ticketguru-kovas.rahtiapp.fi/tickets`, {
                    headers: {
                        Authorization: `Basic ${basicAuth}`
                    }
                });
                const ticketsForEvent = response.data.filter(ticket => ticket.ticketType.event.id === parseInt(id));

                const ticketTypeSales = {};
                let totalAmount = 0;
                let totalCount = 0;
                ticketsForEvent.forEach(ticket => {
                    const { tickettypename, price } = ticket.ticketType;
                    if (!ticketTypeSales[tickettypename]) {
                        ticketTypeSales[tickettypename] = { count: 0, total: 0 };
                    }
                    ticketTypeSales[tickettypename].count++;
                    ticketTypeSales[tickettypename].total += price;
                    totalAmount += price;
                    totalCount++;
                });

                const ticketSalesArray = Object.entries(ticketTypeSales).map(([tickettypename, { count, total }]) => ({
                    tickettypename,
                    count,
                    total
                }));

                setTicketSales(ticketSalesArray);
                setTotalSales({ totalAmount, totalCount });
            } catch (error) {
                console.error('Error fetching ticket sales:', error);
            }
        };

        fetchTicketSales();
    }, [id, basicAuth]);

    return (
        <div>
            <style>
                {`
                table {
                    width: 50%;
                    table-layout: fixed;
                }

                .totalsales {
                    margin-top: 30px;
                }

                
            `}
            </style>
            <h2>Sales Report for Event: {eventName}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Ticket Type</th>
                        <th>Amount Sold</th>
                        <th>Sales per Ticket Type</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketSales.map(({ tickettypename, count, total }) => (
                        <tr key={tickettypename}>
                            <td>{tickettypename}</td>
                            <td>{count}</td>
                            <td>{total.toFixed(2)} €</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div class="totalsales">
            <p>Total Amount Sold: <b>{totalSales.totalCount}</b></p>
            <p>Total Sales: <b>{totalSales.totalAmount.toFixed(2)} €</b></p>
            </div>
        </div>
    );
};

export default EventReport;
