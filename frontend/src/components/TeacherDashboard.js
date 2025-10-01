// Renamed to .jsx for JSX support
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import AssignmentForm from './AssignmentForm.jsx';
import AssignmentList from './AssignmentList.jsx';
import SubmissionList from './SubmissionList.jsx';

export default function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, [filter]);

  const fetchAssignments = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    let data = await res.json();
    if (filter !== 'All') data = data.filter(a => a.status === filter);
    setAssignments(data);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <AssignmentForm onCreated={fetchAssignments} />
      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-1 rounded">
          <option>All</option>
          <option>Draft</option>
          <option>Published</option>
          <option>Completed</option>
        </select>
      </div>
      <AssignmentList assignments={assignments} onSelect={setSelectedAssignment} onUpdated={fetchAssignments} />
      {selectedAssignment && <SubmissionList assignmentId={selectedAssignment._id} />}
    </div>
  );
}