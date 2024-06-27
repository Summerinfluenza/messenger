import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import IconButton from '@mui/material/IconButton';
import TextField from "@mui/material/TextField";
import ChatBox from './Chatbox';

const SearchBar = () => {
    const [input, setInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState("");

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem("userid");
    const userEmail = localStorage.getItem("useremail");


    const fetchData = async (value) => {
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
                setSearchResults(data.data);
            } else {
                console.error('Error: ', response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const fetchFriend = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/auth/getfriends/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.message === 'success') {
                const acceptedFriends = data.data.friends.filter((user) => user.accepted === true);
                setFriends(acceptedFriends.map(user => user.username));
            } else {
                console.error('Error: ', response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }

    }

    const handleChange = (event) => {
        setInput(event.target.value);

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const trimmedInput = input.trim();
        if (trimmedInput.length < 1) {
            setError("Search must be at least 1 character");
            return;
        }
    
        try {
            await fetchData(trimmedInput);
            await fetchFriend(userId);
            // Clear any previous errors if submission is successful
            setError("");
        } catch (error) {
            console.error('Error fetching data: ', error);
            setError("Error fetching data. Please try again."); // Optionally handle error state
        }
    };

    return (
        <div>
            <div className="searchContainer">
                <form onSubmit={handleSubmit}>
                    <TextField
                        id="search-bar"
                        className="text"
                        value={input}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Search user..."
                        size="small"
                        error={!!error}
                        helperText={error}
                    />
                    <IconButton type='submit' aria-label="search">
                        <PersonSearchIcon />
                    </IconButton>
                </form>
            </div>
            <br />
            <div className='userContainer'>
                {searchResults.map((user, index) => (
                    user.email !== userEmail ? (
                        <UserCard key={index} user={user} friends={friends} />
                    ) : null
                ))}
            </div>
        </div>
    );
};

export default SearchBar;


