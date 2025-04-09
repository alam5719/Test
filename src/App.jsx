import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users', formData);
      console.log('User saved:', res.data);
      setMessage('✅ User added successfully!');
      setFormData({ name: '', email: '' });
      fetchUsers(); // refresh user list
      setTimeout(() => setMessage(''), 3000); // clear message after 3s
    } catch (err) {
      console.error('Error saving user:', err);
      setMessage('❌ Failed to save user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Add User</h2>
      <input
        type="text"
        name="name"
        placeholder="Enter name"
        value={formData.name}
        onChange={handleChange}
        style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
      />
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
      />
      <button onClick={handleAdd} style={{ padding: '8px 16px', marginBottom: '10px' }}>
        Add
      </button>

      {/* Success/Error message */}
      {message && <div style={{ marginBottom: '10px', color: 'green' }}>{message}</div>}

      <h3>Existing Users</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.name} - {user.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
