import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Login() {
	const { setUser } = useContext(AuthContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleLogin = async (e) => {
		e.preventDefault();
		setError('');
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const data = await res.json();
			if (data.token) {
				setUser({ ...data, token: data.token });
				localStorage.setItem('token', data.token);
				window.location.href = data.role === 'teacher' ? '/teacher' : '/student';
			} else {
				setError(data.error);
			}
		} catch {
			setError('Server error');
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleLogin}>
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
				{error && <div className="text-red-500 mb-4">{error}</div>}
				<input className="w-full mb-4 p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
				<input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
				<button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
			</form>
		</div>
	);
}
