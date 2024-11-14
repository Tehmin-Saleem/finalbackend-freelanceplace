import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.scss';
import { Header } from '../../components';
import { MapPin, Briefcase, Clock, DollarSign, Paperclip } from 'lucide-react';
const OfferCards = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  // Function to get freelancer ID from the JWT token stored in localStorage
  const getFreelancerIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    }
    return null;
  };

  // Fetching offers when the component mounts
  useEffect(() => {
    const fetchOffers = async () => {
      const freelancerId = getFreelancerIdFromToken();
      if (!freelancerId) {
        setError('Freelancer ID not found.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/freelancer/offer/${freelancerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const sortedOffers = [...response.data].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        
        console.log('Sorted offers:', sortedOffers.map(o => ({ 
          title: o.job_title, 
          date: o.createdAt 
        })));
        
        setOffers(sortedOffers);
      } catch (err) {
        setError('Failed to fetch offers.');
      }
    };

    fetchOffers();
  }, []); // Empty dependency array to run only once when the component mounts
  const handleAcceptOffer = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/freelancer/offers/${offerId}`,
        { status: 'accepted' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setOffers(prevOffers => 
        prevOffers.map(offer => 
          offer._id === offerId ? { ...offer, status: 'accepted' } : offer
        )
      );
      
      alert('Offer accepted successfully');
    } catch (error) {
      alert('Failed to accept offer: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeclineOffer = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/freelancer/offers/${offerId}`,
        { status: 'declined' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setOffers(prevOffers => 
        prevOffers.map(offer => 
          offer._id === offerId ? { ...offer, status: 'declined' } : offer
        )
      );
      
      alert('Offer declined successfully');
    } catch (error) {
      alert('Failed to decline offer: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleViewFile = (fileUrl, fileType) => {
    if (fileType && fileUrl) {
      if (fileType.startsWith('image/') || fileType === 'application/pdf') {
        window.open(fileUrl, '_blank');
      } else {
        alert('Unsupported file type.');
      }
    } else {
      alert("No file available to view.");
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <main className="max-w-4xl mx-auto p-6">
      {offers.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No offers Recieved.
        </div>
      ) : (
        offers.map((offer) => (
          <div key={offer._id} className="mt-8 bg-white shadow-lg rounded-lg">
            {/* Rest of your existing offer card JSX remains the same */}
            <div className="space-y-4 p-6">
            <div className="text-sm text-gray-500 mb-4">
                    Received: {new Date(offer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-sky-600">
                        {(offer.clientFirstName || "John").charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-sky-600">
                        {offer.clientFirstName} {offer.clientLastName} 
                      </h3>
                      <p className="text-sm text-gray-600">Client</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="w-4 h-4">&#x1F4CD;</span>
                    <span>{offer.clientCountry || "Country not specified"}</span>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="ml-1 text-sm text-gray-600">
                        {offer.clientStats?.completedJobs || 0} jobs completed
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-sky-600">Title</h2>
                  <h2 className="text-2xl font-semibold tracking-tight">{offer.job_title}</h2>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-3 bg-sky-100 text-sky-700 rounded-full whitespace-nowrap">
                    <span>Rate:</span>
                    {offer.budget_type === "hourly" ? (
                      <>
                        <span className="w-4 h-4">&#x23F1;</span>
                        <span>
                          ${offer.hourly_rate.from} - ${offer.hourly_rate.to}/hr
                        </span>
                      </>
                    ) : (
                      <>
                        
                        <span>${offer.fixed_price}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 p-6">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-sky-600">Project Description</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{offer.description}</p>
                  {offer.detailed_description && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-md font-medium mb-2 text-sky-600">Additional Details</h3>
                      <p>{offer.detailed_description}</p>
                    </div>
                  )}
                </div>
              </section>

              {offer.preferred_skills && offer.preferred_skills.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {offer.preferred_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {offer.attachment && offer.attachment.fileName && (
                <div className="mt-4">
                  <p>Attachment: {offer.attachment.fileName}</p>
                  <button
                    onClick={() => handleViewFile(offer.attachment.fileUrl, offer.attachment.fileType)}
                    className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
                  >
                    <span className="w-4 h-4">&#x1F441;</span>
                    View Attachment
                  </button>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => handleAcceptOffer(offer._id)}
                  disabled={submitLoading || offer.status === 'accepted' || offer.status === 'declined'}
                  className={`px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 ${
                    (submitLoading || offer.status === 'accepted' || offer.status === 'declined') ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {offer.status === 'accepted' ? 'Accepted' : offer.status === 'declined' ? 'Declined' : submitLoading ? 'Processing...' : 'Accept Offer'}
                </button>
                {offer.status === 'pending' && (
                  <button
                    onClick={() => handleDeclineOffer(offer._id)}
                    disabled={submitLoading}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    {submitLoading ? 'Processing...' : 'Decline Offer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </main>
  </div>
);
};

export default OfferCards;