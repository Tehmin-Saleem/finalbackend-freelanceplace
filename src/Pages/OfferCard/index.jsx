import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Header } from "../../components";
import { MapPin, Briefcase, Clock, DollarSign, Paperclip } from 'lucide-react';
const OfferDetails = () => {
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { notificationId } = useParams(); 
  
    useEffect(() => {
      const fetchOfferDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          console.log('Making API call with offeId:', notificationId);
          const response = await axios.get(
            `http://localhost:5000/api/freelancer/offers/${notificationId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          console.log('offer',response.data )
          setOffer(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching offer details:', error);
          setError(error.response?.data?.message || 'Failed to fetch offer details');
          setLoading(false);
        }
      };
  
      fetchOfferDetails();
    }, [notificationId]);
  const handleAcceptOffer = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/freelancer/offers/${offerId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Handle success - maybe redirect or show success message
    } catch (err) {
      console.error("Error accepting offer:", err);
      // Handle error - show error message
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Offer details not found.
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          
          <main className="max-w-4xl mx-auto p-6">
            <div className="mt-8 bg-white shadow-lg rounded-lg">
              <div className="space-y-4 p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {(offer.clientname || "John Doe").charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{offer.clientname || "John Doe"}</h3>
                    <p className="text-sm text-gray-600">Client</p>
                  </div>
                
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                      {/* Using a simple map pin icon (or you can use your own or an emoji) */}
                      <span className="w-4 h-4">&#x1F4CD;</span>
                      <span>{offer.location || 'Location not specified'}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{offer.job_title}</h1>
                   
                  </div>
                  
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-sky-100 text-sky-700 rounded-full">
                      Rate:{offer.budget_type === "hourly" ? (
                        <>
                          {/* Using a clock emoji for hourly rate */}
                          <span className="w-4 h-4">&#x23F1;</span>
                          <span>{offer.hourly_rate}/hr</span>
                        </>
                      ) : (
                        <>
                          {/* Using a dollar sign emoji for fixed price */}
                          <span className="w-4 h-4">&#x24;</span>
                          <span>{offer.fixed_price}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
    
              </div>
    
              <div className="space-y-8 p-6">
                {/* Project Description */}
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold">Project Description</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p>{offer.description}</p>
                    {offer.detailed_description && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-md font-medium mb-2">Additional Details</h3>
                        <p>{offer.detailed_description}</p>
                      </div>
                    )}
                  </div>
                </section>
    
                {/* Required Skills */}
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
    
                {/* Attachments */}
                {offer.attachment && (
  <section className="space-y-4">
    <h2 className="text-lg font-semibold">Attachments</h2>
    <div className="p-4 bg-gray-50 rounded-lg">
      <a href={offer.attachment?.path || "#"} target="_blank" rel="noopener noreferrer"
         className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
      >
        {/* Using a paperclip emoji for attachment */}
        <span className="w-4 h-4">&#x1F4CE;</span>
        <span>{offer.attachment?.fileName}</span>
      </a>
      {offer.attachment?.description && (
        <p className="mt-2 text-sm text-gray-600">{offer.attachment.description}</p>
      )}
    </div>
  </section>
)}
    
                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={handleAcceptOffer}
                    className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
                  >
                    Accept Offer
                  </button>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    };
    
    export default OfferDetails; 