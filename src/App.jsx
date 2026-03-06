import { Route, Routes } from 'react-router-dom';
import './App.css';
import RequireAuth from './middleware/RequireAuth';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Logout from './components/Logout';
import Books from './components/Books';
import { BookDetail } from './components/BookDetail';
import BookBorrow from './components/BookBorrow';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />

        <Route path='/logout' element={
          <RequireAuth>
            <Logout />
          </RequireAuth>
        } />

        {/* Protected User & Admin Routes */}
        <Route path='/books' element={
          <RequireAuth>
            <Books />
          </RequireAuth>
        } />

        <Route path='/borrow' element={
          <RequireAuth>
            <BookBorrow />
          </RequireAuth>
        } />

        {/* Protected Admin-Only Route */}
        <Route path='/books/:id' element={
          <RequireAuth allowedRoles={['ADMIN']}>
            <BookDetail />
          </RequireAuth>
        } />

      </Routes>
    </>
  );
}

export default App;