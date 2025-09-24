type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-center mt-6">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-1 px-4 py-2 rounded-lg secondary disabled:opacity-50"
            >
                Previous
            </button>

            {/* Page Buttons */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`mx-1 px-4 py-2 rounded-lg ${
                        currentPage === page ? 'primary' : 'secondary'
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="mx-1 px-4 py-2 rounded-lg secondary disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}