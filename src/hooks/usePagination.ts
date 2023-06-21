import { useState } from 'react';

const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [numberTokip, setNumberToSkip] = useState(0);

  const handleNextPage = () => setCurrentPage((v) => v + 1);
  const handlePreviousPage = () => {
    if (currentPage <= 1) return;
    setCurrentPage((v) => v - 1);
  };

  const handleSkip = (overrAllSize: number, returnSize: number) => {
    if (returnSize > overrAllSize && currentPage !== 1) {
      return setNumberToSkip(returnSize);
    }
    if (returnSize > overrAllSize) {
      return setNumberToSkip(10);
    }
    return setNumberToSkip(10);
  };

  return {
    currentPage,
    handleNextPage,
    handlePreviousPage,
    handleSkip,
    numberTokip,
  };
};

export default usePagination;
