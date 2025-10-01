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
						{/* ...rest of your component... */}
					</div>
				</div>
			))}
		</div>
	);
}
