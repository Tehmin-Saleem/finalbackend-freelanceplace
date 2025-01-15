import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import "./styles.scss";

const FreelancerList = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const { id } = useParams(); // Retrieve user ID from URL parameters
  // const [profile, setProfile] = useState(null);


  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found');
        }
        const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
        const response = await fetch(`${BASE_URL}/api/freelancer/freelancerslist`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        console.log(data);
        setFreelancers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching freelancers:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFreelancers();
  }, []);


  const handleSoftBan = async (id, softBanned) => {
    const confirmSoftBan = window.confirm(softBanned ? "Are you sure you want to unban this freelancer?" : "Are you sure you want to soft ban this freelancer?");
    if (!confirmSoftBan) return;

    try {
        const token = localStorage.getItem('token');
        const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
        if (!token) {
          throw new Error('No token found');
        }

      const response = await fetch(`${BASE_URL}/api/freelancer/softban/${id}`, {

        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (response.ok) {
        // Update freelancer list after soft ban
        const updatedFreelancers = freelancers.map(freelancer => freelancer._id === id ? { ...freelancer, softBanned: !softBanned } : freelancer);
        setFreelancers(updatedFreelancers);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error updating freelancer status:', error);
    }
  };







  const handleBan = async (id) => {
    const confirmBan = window.confirm("Are you sure you want to ban and remove this freelancer?");
    if (!confirmBan) return;

    try {

        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found');
        }
      const response = await fetch(`${BASE_URL}/api/freelancer/ban/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (response.ok) {
        if (response.status === 200) {
            // Remove the freelancer from the displayed list
            // setFreelancers(freelancers.filter(freelancer => freelancer._id !== freelancerId));
            // alert(data.message);
        // Remove the freelancer from the list after banning
        const updatedFreelancers = freelancers.filter(freelancer => freelancer._id !== id);
        setFreelancers(updatedFreelancers);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error banning freelancer:', error);
    }
  };

//   if (loading) return <div>Loading...</div>;

// useEffect(() => {
//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         throw new Error('No token found');
//       }

//       const response = await fetch(`http://localhost:5000/api/freelancers/profile/${id}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setProfile(data);
//       } else {
//         console.error('Error fetching profile:', data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchProfile();
// }, [id]);

// if (loading) return <div>Loading profile...</div>;
// if (!profile) return <div>Profile not found</div>;

  if (loading) {
    return <div>Loading freelancers...</div>;
  }

  return (
    <div className="freelancer-list">
    <h2>Freelancers</h2>
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
        {Array.isArray(freelancers) && freelancers.map(freelancer => (
          <tr key={freelancer._id} onClick={() => handleProfileClick(freelancer._id)}>
            <td>{freelancer._id}</td>
            <td>{`${freelancer.first_name} ${freelancer.last_name}`}</td>
            <td>{freelancer.email}</td>
            <td>{freelancer.country_name}</td>
            <td>
              {/* Soft Ban / Unban button */}
              <button
                className={freelancer.softBanned ? 'unban-button' : 'softban-button'}
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleSoftBan(freelancer._id, freelancer.softBanned);
                }}
              >
                {freelancer.softBanned ? 'Unban' : 'Soft Ban'}
              </button>
  
              {/* Full Ban button */}
              <button
                className="ban-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleBan(freelancer._id);
                }}
              >
                {freelancer.banned ? 'Banned' : 'Ban'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default FreelancerList;
