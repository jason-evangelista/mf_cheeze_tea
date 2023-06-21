import { useState } from 'react';

const useToggleContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return {
    isOpen,
    handleToggle,
    handleClose,
  };
};

export default useToggleContainer;
