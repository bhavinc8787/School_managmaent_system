// Renamed to .jsx for JSX support
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function AssignmentList({ assignments, onSelect, onUpdated }) {
  const { user } = useContext(AuthContext);

  const handlePublish = async (id) => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/${id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Published' })
    });
    onUpdated();
  };

  const handleComplete = async (id) => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/${id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Completed' })
    });
    onUpdated();
  };

  const handleDelete = async (id) => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    });
    onUpdated();
  };

  return (
    <div>
      {assignments.map(a => (
        <div key={a._id} className="border p-4 mb-2 rounded flex justify-between items-center">
          <div>
            <h3 className="font-bold">{a.title}</h3>
            <p>{a.description}</p>
            <p>Status: {a.status}</p>
            <p>Due: {new Date(a.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            {a.status === 'Draft' && (
              <>
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handlePublish(a._id)}>Publish</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(a._id)}>Delete</button>
              </>
            )}
            {a.status === 'Published' && (
              <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleComplete(a._id)}>Complete</button>
            )}
            <button className="ml-2 underline text-blue-700" onClick={() => onSelect(a)}>View Submissions</button>
          </div>
        </div>
      ))}
    </div>
  );
}