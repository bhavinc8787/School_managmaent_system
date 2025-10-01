import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

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
			{/* ...rest of your component... */}
		</div>
	);
}
