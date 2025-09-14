import React from 'react';
import { Dialog, DialogRoot, DialogTitle, DialogDescription, DialogButton, DialogClose } from '../ui/Dialog';

export interface SubmissionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onPreSubmission: () => void;
  onSubmission: () => void;
  challenge: { id: string };
}

export function SubmissionConfirmation({
  isOpen,
  onClose,
  onPreSubmission,
  onSubmission,
  challenge,
}: SubmissionConfirmationProps) {
  const handleConfirmSubmission = () => {
    onSubmission();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      onPreSubmission();
    }
  }, [isOpen, onPreSubmission]);

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <Dialog onClose={handleCancel} onBackdrop={handleCancel}>
        <DialogTitle>
          Submit Challenge
          <DialogClose />
        </DialogTitle>
        <DialogDescription>
          Are you ready to submit your solution for this challenge? This action cannot be undone.
        </DialogDescription>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-bolt-elements-borderColor">
          <DialogButton type="secondary" onClick={handleCancel}>
            Cancel
          </DialogButton>
          <DialogButton type="primary" onClick={handleConfirmSubmission}>
            Submit Solution
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
}