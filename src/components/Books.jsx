import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Link } from "react-router-dom";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const { user } = useUser();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchBooks = async () => {
    const params = new URLSearchParams();
    if (filterTitle) params.append("title", filterTitle);
    if (filterAuthor) params.append("author", filterAuthor);

    const res = await fetch(`${API_URL}/api/book?${params.toString()}`, { credentials: "include" });
    if (res.ok) setBooks(await res.json());
  };

  useEffect(() => { fetchBooks(); }, [filterTitle, filterAuthor]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const newBook = {
      title: e.target.title.value, author: e.target.author.value,
      quantity: parseInt(e.target.quantity.value), location: e.target.location.value, status: "Available"
    };
    await fetch(`${API_URL}/api/book`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook), credentials: "include"
    });
    fetchBooks();
    e.target.reset();
  };

  return (
    <div className="container">
      <h2>Book Catalog</h2>
      <div className="card flex">
        <input className="input" placeholder="Filter Title..." value={filterTitle} onChange={e => setFilterTitle(e.target.value)} style={{ marginBottom: 0 }} />
        <input className="input" placeholder="Filter Author..." value={filterAuthor} onChange={e => setFilterAuthor(e.target.value)} style={{ marginBottom: 0 }} />
      </div>

      {user.role === "ADMIN" && (
        <div className="card">
          <h3>Create New Book</h3>
          <form onSubmit={handleCreate} className="flex">
            <input className="input" name="title" placeholder="Title" required style={{ marginBottom: 0 }} />
            <input className="input" name="author" placeholder="Author" required style={{ marginBottom: 0 }} />
            <input className="input" name="quantity" type="number" placeholder="Qty" required style={{ marginBottom: 0 }} />
            <input className="input" name="location" placeholder="Location" required style={{ marginBottom: 0 }} />
            <button className="btn" type="submit">Add Book</button>
          </form>
        </div>
      )}

      {/* ✅ CHANGED: Removed "grid" and made it a vertical list of full-width flex cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {books.map(b => (
          <div key={b._id} className="card flex-between" style={{ margin: 0 }}>

            {/* Left Side: Book Info */}
            <div>
              <h3 style={{ margin: '0 0 10px 0' }}>{b.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-light)' }}>
                Author: <strong>{b.author}</strong> &nbsp;|&nbsp;
                Qty: <strong>{b.quantity}</strong> &nbsp;|&nbsp;
                Loc: <strong>{b.location}</strong>
              </p>
              {b.deleted && <span style={{ color: 'red', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>Soft Deleted</span>}
            </div>

            {/* Right Side: Buttons */}
            <div className="flex">
              {(user.role === "USER" || !user.role) && !b.deleted && (
                <Link to="/borrow" className="btn" style={{ textDecoration: 'none' }}>Request Book</Link>
              )}

              {user.role === "ADMIN" && (
                <Link to={`/books/${b._id}`} className="btn btn-outline" style={{ textDecoration: 'none', border: '1px solid var(--border)', color: 'black' }}>Manage</Link>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}