import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [info, setInfo] = useState('')
    const [age, setAge] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate()

    const createButtonClick = () => {
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
        signup();
    }

    const loginButtonClick = () => {
        navigate('/');
    }

    
    const signup = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username, info, age }),
            });

            const data = await response.json();
    
            if (data.message === "success") {
                navigate('/');
                window.alert('Account has been created.');
            } else {
                window.alert('Error occured during signup.');
            }
        } catch (error) {
            console.error('Error signup: ', error);
            window.alert('Error signup. Please try again later.');
        }
    };


    return (
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Create Account</div>
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
                    value={username}
                    placeholder="Enter a username"
                    onChange={(ev) => setUsername(ev.target.value)}
                    className={'inputBox'}
                />
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={info}
                    placeholder="Introduce yourself..."
                    onChange={(ev) => setInfo(ev.target.value)}
                    className={'inputBox'}
                />
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={age}
                    placeholder="Enter your age"
                    onChange={(ev) => setAge(ev.target.value)}
                    className={'inputBox'}
                />
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={password}
                    placeholder="Create a new password"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />

            <div className={'buttonContainer'}>
                <input className={'inputButton'} type="button" onClick={loginButtonClick} value={'Log In'} />
                <input className={'inputButton'} type="button" onClick={createButtonClick} value={'Create'} />
                
            </div>
        </div>
    )
}

export default Signup