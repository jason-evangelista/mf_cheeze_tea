import { useState } from 'react';

const useToggleContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return {
    isOpen,
    handleToggle,
  };
};

export default useToggleContainer;
