import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Button from '../Button';

type PaginationProps = {
  currentPage: number;
  overAllSize: number;
  returnCurrentSize: number;
  handleBack: () => void;
  handleNext: () => void;
  refetch: () => void;
  isLoading: boolean;
};

function Pagination({
  currentPage,
  overAllSize,
  handleBack,
  handleNext,
  returnCurrentSize,
  isLoading,
}: PaginationProps) {
  const [hasNextPage, setHasNextPage] = useState(true);

  const calculatePossiblePage = Math.ceil(overAllSize / 10);
  useEffect(() => {
    if (currentPage < calculatePossiblePage) {
      setHasNextPage(true);
    } else {
      setHasNextPage(false);
    }
  }, [currentPage, overAllSize]);

  const paginationClassname = clsx([
    'flex items-center my-2',
    {
      'gap-4': overAllSize > 10,
    },
  ]);

  return (
    <div className={paginationClassname}>
      <div className="flex items-center gap-2 my-2">
        {overAllSize > 10 && (
          <>
            <Button
              onClick={handleBack}
              btnTitle={<IconChevronLeft size={20} />}
              className="bg-blue-500 p-[3px]"
            />
            {hasNextPage && (
              <Button
                onClick={handleNext}
                btnTitle={<IconChevronRight size={20} />}
                className="bg-blue-500 p-[3px]"
              />
            )}
          </>
        )}
      </div>
      {isLoading || !overAllSize ? null : (
        <div>
          <p className="text-sm font-semibold">
            Showing&nbsp;{returnCurrentSize}
            &nbsp;of&nbsp;10&nbsp;in&nbsp;Page&nbsp;{currentPage}&nbsp;of&nbsp;
            {calculatePossiblePage}&nbsp;Total of&nbsp;{overAllSize}
          </p>
        </div>
      )}
    </div>
  );
}

export default Pagination;
