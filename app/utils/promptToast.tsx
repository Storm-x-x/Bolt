import React from 'react';
import { toast } from 'react-toastify';

export const sendPromptStatusToast = (message: string, rating: number, playSuccess: () => void, playFailure: () => void) => {
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`text-lg ${
            star <= rating
              ? 'i-ph:star-fill text-yellow-400'
              : 'i-ph:star text-gray-400'
          }`}
        />
      ))}
    </div>
  );

  const toastContent = (
    <div className="flex flex-col">
      <span className="font-medium">{message}</span>
      <StarRating rating={rating} />
    </div>
  );

  if (rating >= 3) {
    playSuccess();
    toast.success(toastContent, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } else {
    playFailure();
    toast.error(toastContent, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};