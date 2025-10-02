import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrevious,
}: PaginationProps) {
  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex rounded-md shadow">
        <button 
          onClick={onPrevious}
          disabled={currentPage === 0}
          className={`px-4 py-2 text-sm font-medium rounded-l-md transition-all duration-200 
            ${currentPage === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-inner active:bg-gray-200 active:scale-95 active:shadow-inner'
            } border border-gray-300`}
        >
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-300 transition-all duration-200
              ${currentPage === index
                ? 'bg-black-600 text-white shadow-inner'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-inner active:bg-gray-200 active:scale-95 active:shadow-inner'
              }`}
          >
            {index + 1}
          </button>
        ))}
        
        <button
          onClick={onNext}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 text-sm font-medium rounded-r-md transition-all duration-200
            ${currentPage === totalPages - 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-inner active:bg-gray-200 active:scale-95 active:shadow-inner'
            } border border-gray-300`}
        >
          Next
        </button>
      </nav>
    </div>
  );
}