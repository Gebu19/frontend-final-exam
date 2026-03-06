import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    // ✅ CHANGED to /api/book (singular)
    fetch(`${API_URL}/api/book/${id}`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load book");
        setBook(data);
      })
      .catch((error) => {
        alert(error.message);
        navigate("/books");
      });
  }, [id, API_URL, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      title: e.target.title.value,
      author: e.target.author.value,
      quantity: parseInt(e.target.quantity.value)
    };
    // ✅ CHANGED to /api/book (singular)
    const res = await fetch(`${API_URL}/api/book/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData), credentials: "include"
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Update failed");
      return;
    }
    navigate("/books");
  };

  const handleDelete = async () => {
    // ✅ CHANGED to /api/book (singular)
    const res = await fetch(`${API_URL}/api/book/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Delete failed");
      return;
    }
    navigate("/books");
  };

  if (!book) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <h2>Manage Book: {book.title}</h2>
        <form onSubmit={handleUpdate}>
          <label>Title</label>
          <input className="input" name="title" defaultValue={book.title} />
          <label>Author</label>
          <input className="input" name="author" defaultValue={book.author} />
          <label>Quantity</label>
          <input className="input" name="quantity" type="number" defaultValue={book.quantity} />
          <div className="flex">
            <button className="btn" type="submit">Update Book</button>
            <button className="btn btn-danger" type="button" onClick={handleDelete}>Soft Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
}
