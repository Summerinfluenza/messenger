import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './auth/Home'
import Login from './auth/Login'
import Signup from './auth/SignUp'
import './App.css'
import { useEffect, useState } from 'react'

function App() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch the user email and token from local storage
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');

                // If the token/email does not exist, mark the user as logged out
                if (!token) {
                    setLoggedIn(false);
                    return;
                }
                // If the token exists, verify it with the auth server to see if it is valid
                const response = await fetch('http://localhost:5000/auth/verify', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();

                if (result.message === 'success') {
                    setLoggedIn(true);
                    setEmail(email || '');
                } else {
                    setLoggedIn(false);
                }
            } catch (error) {
                console.error('Error verifying user:', error);
                setLoggedIn(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
                    <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
                    <Route path="/home" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App