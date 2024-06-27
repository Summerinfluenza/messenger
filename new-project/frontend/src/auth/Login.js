import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate()

    const logInButtonClick = () => {
        // Set initial error values to empty
        setEmailError('')
        setPasswordError('')

        // Check if the user has entered both fields correctly
        if ('' === email) {
            setEmailError('Please enter your email')
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email')
            return
        }

        if ('' === password) {
            setPasswordError('Please enter a password')
            return
        }

        if (password.length < 7) {
            setPasswordError('The password must be 8 characters or longer')
            return
        }
        logIn();
    }

    const signUpButtonClick = () => {
        navigate('/signup');
    }

    // Log in a user using email and password
    const logIn = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
    
            if (data.message === 'success') {
                localStorage.setItem('user', JSON.stringify({ email, user: data.user, token: data.token }));
                localStorage.setItem('userid', data.user._id);
                localStorage.setItem('useremail', email);
                localStorage.setItem('token', data.token);
                props.setLoggedIn(true);
                props.setEmail(email);
                navigate('/home');
            } else {
                window.alert('Wrong email or password');
            }
        } catch (error) {
            console.error('Error logging in: ', error);
            window.alert('Error logging in. Please try again later.');
        }
    };


    return (
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Login</div>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{emailError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={'buttonContainer'}>
                <input className={'inputButton'} type="button" onClick={logInButtonClick} value={'Log in'} />
                <input className={'inputButton'} type="button" onClick={signUpButtonClick} value={'Signup'} />
            </div>
        </div>
    )
}

export default Login