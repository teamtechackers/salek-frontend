import { ICONS } from "../constants/assets"

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages === 0) return null;

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2  md:justify-end lg:justify-end"
      aria-label="Pagination"
    >
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-50"
      >
        <img
          className="h-4 w-4"
          src={ICONS.paginationleftarrow}
          alt="prev"
        />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
  <button
    key={page}
    type="button"
    aria-current={page === currentPage ? "page" : undefined}
    onClick={() => onPageChange(page)}
    className={`rounded-md px-3 py-1.5 text-sm hover:bg-muted ${
      page === currentPage ? "bg-blue-600 text-white" : ""
    }`}
  >
    {page}
  </button>
))}


      <button
        type="button"
        aria-label="Next page"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-50"
      >
        <img
          className="h-4 w-4"
          src={ICONS.paginationrightarrow}
          alt="next"
          aria-hidden="true"
        />
      </button>
    </nav>
  )
}
