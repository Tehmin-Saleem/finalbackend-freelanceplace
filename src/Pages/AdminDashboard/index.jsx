import React, { useState, useEffect } from 'react';
import { FaUser, FaUsers, FaEnvelope, FaChartLine, FaCog, FaBell, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles.scss';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [queries, setQueries] = useState([]);
    const [freelancerCount, setFreelancerCount] = useState(0);
    const [clientCount, setClientCount] = useState(0);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQueryResolved, setIsQueryResolved] = useState(false);
    const navigate = useNavigate(); 
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

  // Fetch counts and queries
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (isTokenExpired) {
          console.error('Token has expired');
          return; 
        }

        const queryResponse = await fetch('http://localhost:5000/api/freelancer/queries', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!queryResponse.ok) {
          throw new Error(`Error: ${queryResponse.statusText}`);
        }

        const queryData = await queryResponse.json();
        setQueries(queryData);

        const freelancerResponse = await fetch('http://localhost:5000/api/freelancer/count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!freelancerResponse.ok) {
          throw new Error('Failed to fetch freelancer count');
        }

        const freelancerData = await freelancerResponse.json();
        setFreelancerCount(freelancerData.count);

        const clientResponse = await fetch('http://localhost:5000/api/client/count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!clientResponse.ok) {
          throw new Error('Failed to fetch client count');
        }

        const clientData = await clientResponse.json();
        setClientCount(clientData.count);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleResolveClick = async (queryId) => {
    const response = await fetch(`http://localhost:5000/api/freelancer/queries/${queryId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const queryData = await response.json();
      setSelectedQuery(queryData);
      setIsModalOpen(true);
    } else {
      console.error('Failed to fetch query details');
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuery(null);
  };

  const handleConfirmResolve = async (queryId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/freelancer/queries/${queryId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ status: 'Resolved' }),  // Send the updated status
        });

        if (!response.ok) {
            throw new Error('Failed to update query status');
        }

        // Update local state to reflect the change
        setQueries(prevQueries =>
            prevQueries.map(query =>
                query._id === queryId ? { ...query, status: 'Resolved' } : query
            )
        );

        setIsQueryResolved(true); // Mark as resolved in local state
        setSelectedQuery(prev => ({ ...prev, status: 'Resolved' }));  // Update the selected query

        // Close the modal after successfully resolving the query
        handleCloseModal();  // Close the modal after query resolution

    } catch (error) {
        console.error('Error updating query status:', error);
    }
   
};

  return (
    <div className="admin-dashboard">
    <aside className={isSidebarOpen ? 'sidebar open' : 'sidebar closed'}>
        <div className="logo">Admin Panel</div>
        <ul className="menu">
            <li><FaChartLine /> Dashboard</li>
            <li onClick={() => navigate('/freelancerslist')}><FaUsers /> Freelancers</li>
            <li><FaUser /> Clients</li>
            <li><FaEnvelope /> Queries</li>
            <li><FaCog /> Settings</li>
        </ul>
    </aside>

    <div className="main-content">
        <header className="top-bar">
            <button className="menu-button" onClick={toggleSidebar}>
                <FaBars />
            </button>
            <div className="admin-info">
                <FaBell className="icon" />
                <img
                    src="https://via.placeholder.com/40"
                    alt="Admin Profile"
                    className="admin-avatar"
                />
                <span>Admin Name</span>
            </div>
        </header>

        <section className="dashboard-summary">
            <div className="card" onClick={() => navigate('/freelancerslist')}>
                <FaUsers className="card-icon" />
                <h3>Freelancers</h3>
                <p>{freelancerCount}</p>
            </div>
            <div className="card" onClick={() => navigate('/clientslist')}>
                <FaUser className="card-icon" />
                <h3>Clients</h3>
                <p>{clientCount}</p>
            </div>
            <div className="card">
                <FaEnvelope className="card-icon" />
                <h3>Active Queries</h3>
                <p>{queries.length}</p>
            </div>
        </section>

        <section className="queries-section">
            <h2>Recent Queries</h2>
            <table className="queries-table">
                <thead>
                    <tr>
                        <th>Query ID</th>
                        <th>Type</th>
                        <th>From</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {queries.map(query => (
                        <tr key={query._id}>
                            <td>{query._id}</td>
                            <td>{query.queryType}</td>
                            <td>{query.name}</td>
                            <td>{query.message}</td>
                            <td>{query.status || 'Pending'}</td>
                            <td>
                                <button className="resolve-btn" onClick={() => handleResolveClick(query._id)}>
                                    {query.status === 'Resolved' ? 'View' : 'Resolve'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>

        {isModalOpen && selectedQuery && (
    <div className="modal-overlay">
        <div className="modal">
            <h2>Query Details</h2>
            <div className="modal-content">
                <p><strong>Query ID:</strong> {selectedQuery._id}</p>
                <p><strong>Type:</strong> {selectedQuery.queryType}</p>
                <p><strong>From:</strong> {selectedQuery.name}</p>
                <p><strong>Message:</strong> {selectedQuery.message}</p>
                <p><strong>Status:</strong> {selectedQuery.status}</p>

                {/* Show message only when the user clicks 'View' button */}
                {isQueryResolved && selectedQuery.status === 'Resolved' && (
                    <p style={{ marginTop: '20px', color: 'green' }}>
                        Your query has been successfully resolved.
                    </p>
                )}
            </div>
            <div className="button-group">
                <button 
                    className="resolve-confirm-btn" 
                    onClick={() => handleConfirmResolve(selectedQuery._id)}
                >
                    {selectedQuery.status === 'Resolved' ? 'View' : 'Complete Query'}
                </button>
                <button className="modal-close-btn" onClick={handleCloseModal}>
                    Close
                </button>
            </div>
        </div>
    </div>
)}

    </div>
</div>
);
};

export default AdminDashboard;
