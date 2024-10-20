import React, { useState, useEffect } from 'react';
import { FaUser, FaUsers, FaEnvelope, FaChartLine, FaCog, FaBell, FaBars } from 'react-icons/fa';
import './styles.scss';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [queries, setQueries] = useState([]); // State to hold the queries
  const [freelancerCount, setFreelancerCount] = useState(0); // State for freelancer count
  const [clientCount, setClientCount] = useState(0); // State for client count

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch counts and queries
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (isTokenExpired) {
          console.error("Token has expired");
          return; // Handle expiration
        }

        // Fetch queries
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

        // Fetch freelancer count
        const freelancerResponse = await fetch('http://localhost:5000/api/freelancer/count', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Add this if you have token-based authentication
            },
          });
          console.log("counttttt",freelancerResponse)

        if (!freelancerResponse.ok) {
          throw new Error('Failed to fetch freelancer count');
        }

        const freelancerData = await freelancerResponse.json();
        setFreelancerCount(freelancerData.count);

        // Fetch client count
        const clientResponse = await fetch('http://localhost:5000/api/client/count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("counttttt client",clientResponse)

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
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={isSidebarOpen ? 'sidebar open' : 'sidebar closed'}>
        <div className="logo">Admin Panel</div>
        <ul className="menu">
          <li><FaChartLine /> Dashboard</li>
          <li><FaUsers /> Freelancers</li>
          <li><FaUser /> Clients</li>
          <li><FaEnvelope /> Queries</li>
          <li><FaCog /> Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
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

        {/* Dashboard Summary */}
        <section className="dashboard-summary">
          <div className="card">
            <FaUsers className="card-icon" />
            <h3>Freelancers</h3>
            <p>{freelancerCount}</p> {/* Show fetched freelancer count */}
          </div>
          <div className="card">
            <FaUser className="card-icon" />
            <h3>Clients</h3>
            <p>{clientCount}</p> {/* Show fetched client count */}
          </div>
          <div className="card">
            <FaEnvelope className="card-icon" />
            <h3>Active Queries</h3>
            <p>{queries.length}</p> {/* Show the number of queries */}
          </div>
        </section>

        {/* Queries Section */}
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
                <td><button className="resolve-btn">Resolve</button></td>
              </tr>
            ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
