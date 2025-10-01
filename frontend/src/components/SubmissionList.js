// Renamed to .jsx for JSX support
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function SubmissionList({ assignmentId }) {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/${assignmentId}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setSubmissions(await res.json());
  };

  const handleReview = async (id) => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/${id}/review`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` }
    });
    fetchSubmissions();
  };

  return (
    <div className="mt-4">
      <h2 className="font-bold mb-2">Submissions</h2>
      {submissions.map(s => (
        <div key={s._id} className="border p-2 mb-2 rounded">
          <p><b>Student:</b> {s.studentId.name}</p>
          <p><b>Answer:</b> {s.answer}</p>
          <p><b>Date:</b> {new Date(s.submittedAt).toLocaleString()}</p>
          <p><b>Reviewed:</b> {s.reviewed ? 'Yes' : 'No'}</p>
          {!s.reviewed && <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleReview(s._id)}>Mark as Reviewed</button>}
        </div>
      ))}
    </div>
  );
}