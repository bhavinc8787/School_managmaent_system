// Renamed to .jsx for JSX support
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function AssignmentForm({ onCreated }) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
  await fetch(`${import.meta.env.VITE_API_URL}/api/assignments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, dueDate })
    });
    setTitle(''); setDescription(''); setDueDate('');
    onCreated();
  };

  return (
    <form className="mb-4" onSubmit={handleCreate}>
      <input className="border p-2 rounded mr-2" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <input className="border p-2 rounded mr-2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <input className="border p-2 rounded mr-2" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
      <button className="bg-green-500 text-white py-1 px-4 rounded">Create</button>
    </form>
  );
}