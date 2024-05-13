import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onAuthentication }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        const validCredentials = [
            { username: 'mikko', password: 'admin' },
            { username: 'maija', password: 'user' }
        ];

        const isValidCredential = validCredentials.some(
            cred => cred.username === username && cred.password === password
        );

        if (!isValidCredential) {
            setErrorMessage('Invalid username or password');
            return;
        }

        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        onAuthentication(true);
        navigate('/');
    };

    return (
        <div>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <br />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button class="loginbutton" onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
