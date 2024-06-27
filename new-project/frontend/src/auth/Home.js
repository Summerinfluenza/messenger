import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './Search';
import FriendList from './Friendlist';


const Home = (props) => {
    const { loggedIn, email, setLoggedIn } = props;
    const token = localStorage.getItem('token');
    const [user, setUser] = useState("");
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const navigate = useNavigate();

    const fetchUser = async (value) => {
        try {
            const response = await fetch("http://localhost:5000/auth/findall", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value }),
            });

            const data = await response.json();
            if (data.message === 'success') {
                setUser(data.data[0]);
            } else {
                console.error('Error: ', response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const onButtonClick = () => {
        if (loggedIn) {

            localStorage.removeItem('token');
            setLoggedIn(false);
        }
        navigate('/');
    };

    useEffect(() => {
        if (currentUser.email) {
            fetchUser(currentUser.email);
        }
    }, [currentUser.email]);

    return (
        <div className="mainContainer">
            <div className='headerContainer'>
                <div className="titleContainer">
                    {loggedIn && <div>Welcome!</div>}

                </div>
                <div className="buttonContainer">
                    <input
                        className="inputButton"
                        type="button"
                        onClick={onButtonClick}
                        value={loggedIn ? 'Log out' : 'Log in'}
                    />
                </div>
            </div>


            {loggedIn && (
                <div className="userinfoContainer">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Age:</strong> {user.age}</p>
                    <p><strong>Description:</strong> {user.info}</p>
                </div>
            )}

            <br />

            <div className='interactionContainer'>
                <div className='searchContainer'>
                    {loggedIn && <SearchBar />}
                </div>

                <div className='bottomContainer'>
                    {loggedIn && <FriendList />}
                </div>

            </div>


            <br />

        </div>
    );
};

export default Home;
