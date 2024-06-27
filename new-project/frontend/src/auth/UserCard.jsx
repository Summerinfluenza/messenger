import React, { useState, useEffect } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import IconButton from '@mui/material/IconButton';

const UserCard = ({ user, friends }) => {
    const userId = localStorage.getItem("userid");
    const token = localStorage.getItem('token');

    const sendFriendRequest = async (email) => {
        try {
            const response = await fetch("http://localhost:5000/auth/friendrequest", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId, friendname: email }),
            });


            const data = await response.json();
            window.alert(data.message);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const sendRequestButtonClick = () => {
        if (!friends.includes(user.email)) {
            sendFriendRequest(user.email);
        }
    }

    const friendButtonClick = () => {
        window.alert("Already friend with this person.");

    }

    return (
        <div className="userCard">
            <div>
                <p>{user.email}</p>
            </div>
            
            <div className="userButton">
                {friends.includes(user.email) ? (
                    <IconButton aria-label="friend" onClick={friendButtonClick}>
                        <PeopleIcon />
                    </IconButton>
                ) : (

                    <IconButton aria-label="sendrequest" onClick={sendRequestButtonClick}>
                        <PersonAddIcon />
                    </IconButton>
                )}
            </div>
        </div>
    );
};

export default UserCard;