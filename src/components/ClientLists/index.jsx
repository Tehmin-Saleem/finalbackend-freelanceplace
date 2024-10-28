import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.scss";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:5000/api/client/clientslist', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        console.log(data);
        setClients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleBan = (id) => {
    console.log(`Client with id ${id} has been banned.`);
  };

  const handleProfileClick = (id) => {
    navigate(`/client/${id}`); // Adjust route to match client profile view
  };

  if (loading) {
    return <div>Loading clients...</div>;
  }

  return (
    <div className="client-list">
      <h2>Clients</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clients) && clients.map((client) => (
            <tr key={client._id} onClick={() => handleProfileClick(client._id)}>
              <td>{client._id}</td>
              <td>{`${client.first_name} ${client.last_name}`}</td>
              <td>{client.email}</td>
              <td>{client.country_name}</td>
              <td>
                <button
                  className="ban-button"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleBan(client._id);
                  }}
                >
                  {client.banned ? 'Banned' : 'Ban'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
