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
        setClients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSoftBan = async (id, softBanned) => {
    const confirmSoftBan = window.confirm(softBanned ? "Are you sure you want to unban this client?" : "Are you sure you want to soft ban this client?");
    if (!confirmSoftBan) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:5000/api/client/softban/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (response.ok) {
        const updatedClients = clients.map(client => client._id === id ? { ...client, softBanned: !softBanned } : client);
        setClients(updatedClients);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error updating client status:', error);
    }
  };

  const handleBan = async (id) => {
    const confirmBan = window.confirm("Are you sure you want to ban and remove this client?");
    if (!confirmBan) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`http://localhost:5000/api/client/ban/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (response.ok) {
        const updatedClients = clients.filter(client => client._id !== id);
        setClients(updatedClients);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error banning client:', error);
    }
  };

  const handleProfileClick = (id) => {
    navigate(`/client/${id}`);
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
          {Array.isArray(clients) && clients.map(client => (
            <tr key={client._id} onClick={() => handleProfileClick(client._id)}>
              <td>{client._id}</td>
              <td>{`${client.first_name} ${client.last_name}`}</td>
              <td>{client.email}</td>
              <td>{client.country_name}</td>
              <td>
                <button
                  className={client.softBanned ? 'unban-button' : 'softban-button'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSoftBan(client._id, client.softBanned);
                  }}
                >
                  {client.softBanned ? 'Unban' : 'Soft Ban'}
                </button>
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
