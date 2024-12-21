import React from 'react';
import { Check, X } from 'lucide-react';

const JobPostedPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative transform transition-all">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-emerald-500" />
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Job Posted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for submitting. Your job listing is now live and ready to attract the perfect talent! 
            <span className="inline-block ml-2">🎉</span>
          </p>
          
          {/* Action buttons */}
          <div className="space-y-3">
          <button
  onClick={onClose}
  className="w-full bg-sky-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-sky-500 transition-colors"
>
              Back to Dashboard
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostedPopup;