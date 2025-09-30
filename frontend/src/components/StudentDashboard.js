import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    const data = await res.json();
    setAssignments(data);
    // Fetch submissions for each assignment
    for (const a of data) {
  const subRes = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/${a._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const subData = await subRes.json();
      setSubmissions(prev => ({ ...prev, [a._id]: subData.find(s => s.studentId._id === user.id) }));
    }
  };

  const handleSubmit = async (assignmentId, answer) => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId, answer })
    });
    fetchAssignments();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      {assignments.map(a => (
        <div key={a._id} className="border p-4 mb-4 rounded">
          <h2 className="font-bold">{a.title}</h2>
          <p>{a.description}</p>
          <p>Due: {new Date(a.dueDate).toLocaleDateString()}</p>
          {submissions[a._id] ? (
            <div>
              <p className="text-green-600">Submitted: {submissions[a._id].answer}</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); handleSubmit(a._id, e.target.answer.value); }}>
              <input name="answer" className="border p-2 rounded w-full mb-2" placeholder="Your answer" required />
              <button className="bg-blue-500 text-white py-1 px-4 rounded">Submit</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}