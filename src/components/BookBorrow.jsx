import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";

export default function BookBorrow() {
  const [requests, setRequests] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");

  const { user } = useUser();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchRequests = async () => {
    const res = await fetch(`${API_URL}/api/borrow`, { credentials: "include" });
    if (res.ok) setRequests(await res.json());
  };

  const fetchBooks = async () => {
    const res = await fetch(`${API_URL}/api/book`, { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    const visibleBooks = data.filter((book) => !book.deleted);
    setBooks(visibleBooks);
    if (visibleBooks.length > 0) {
      setSelectedBookId((prev) => prev || visibleBooks[0]._id);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchBooks();
  }, []);

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!selectedBookId) return;
    const res = await fetch(`${API_URL}/api/borrow`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: selectedBookId, targetDate: e.target.targetDate.value }),
      credentials: "include"
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Request failed");
      return;
    }
    fetchRequests();
    e.target.targetDate.value = "";
  };

  // ✅ NEW: Function to handle changing the status
  const handleUpdateStatus = async (requestId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change this request to: ${newStatus}?`)) return;

    const res = await fetch(`${API_URL}/api/borrow/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestStatus: newStatus }),
      credentials: "include"
    });

    if (res.ok) {
      fetchRequests(); // Refresh the list
    } else {
      alert("Failed to update status");
    }
  };

  const getBookLabel = (bookId) => {
    const book = books.find((item) => item._id === bookId);
    if (!book) return `Unknown Book`;
    return book.title;
  };

  return (
    <div className="container">

      {/* Hide the submission form if it's an Admin (Admins only manage requests) */}
      {user.role !== "ADMIN" && (
        <div className="card">
          <h2>Submit Borrow Request</h2>
          <form onSubmit={handleBorrow} className="flex">
            <select
              className="input"
              name="bookId"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              required
              style={{ marginBottom: 0 }}
            >
              {books.length === 0 && <option value="">No available books</option>}
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title}
                </option>
              ))}
            </select>
            <input className="input" name="targetDate" type="date" required style={{ marginBottom: 0 }} />
            <button className="btn" type="submit" disabled={!selectedBookId}>Request</button>
          </form>
          {books.length === 0 && <p style={{ marginTop: '15px', marginBottom: 0 }}>No books available to request right now.</p>}
        </div>
      )}

      <h2>{user.role === "ADMIN" ? "Manage Borrowing Requests" : "Your Borrowing History"}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {requests.map(req => (
          <div key={req._id} className="card flex-between" style={{ margin: 0 }}>

            {/* Left Side: History Details */}
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}><strong>Book:</strong> {getBookLabel(req.bookId)}</p>

              <p style={{ margin: '0 0 8px 0', color: 'var(--text-light)' }}>
                <strong>Borrower:</strong> {req.userEmail || "Unknown"}
              </p>

              <p style={{ margin: 0, color: 'var(--text-light)' }}>
                <strong>Target Date:</strong> {new Date(req.targetDate).toLocaleDateString()}
              </p>
            </div>

            {/* Right Side: Status Badge & Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: 'var(--border)',
                borderRadius: '6px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '12px'
              }}>
                {req.requestStatus}
              </span>

              {/* ✅ ACTION BUTTONS: Only show if status is "init" */}
              {req.requestStatus === "init" && (
                <div className="flex">

                  {/* ADMIN BUTTONS */}
                  {user.role === "ADMIN" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(req._id, "accept")}
                        className="btn"
                        style={{ padding: '6px 10px', fontSize: '12px', backgroundColor: '#10b981' }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req._id, "cancel")}
                        className="btn btn-danger"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* USER BUTTONS */}
                  {(user.role === "USER" || !user.role) && (
                    <button
                      onClick={() => handleUpdateStatus(req._id, "cancel")}
                      className="btn btn-danger"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                    >
                      Cancel Request
                    </button>
                  )}

                </div>
              )}

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
