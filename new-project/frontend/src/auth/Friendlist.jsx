import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import ChatBox from './Chatbox';
import PeopleIcon from '@mui/icons-material/People';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const FriendList = () => {
    const userId = localStorage.getItem("userid");
    const [chatName, setChatName] = useState("");
    const [friendList, setFriendList] = useState([]);
    const [chatMembers, setChatMembers] = useState([]);
    const [profileOpen, setProfileOpen] = useState(false);
    const [friendProfile, setFriendProfile] = useState(null);
    const token = localStorage.getItem('token');

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
                setFriendList(data.data.friends);
            } else {
                console.error('Error: ', response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const addFriend = async (name) => {
        try {
            const response = await fetch("http://localhost:5000/auth/addfriend", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId, friendname: name }),
            });

            const data = await response.json();
            if (data.message === 'success') {
                fetchFriend(userId);
            } else {
                console.error('Error: ', response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const getUserId = async (email) => {
        try {
            const response = await fetch("http://localhost:5000/auth/getuserid", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            const data = await response.json();
            if (data.message === 'success') {
                setChatMembers([userId, data.userId]);
            } else {
                console.error('Error: ', response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

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
                setFriendProfile(data.data[0]);
            } else {
                console.error('Error: ', response.message);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchFriend(userId);
        }
    }, [userId]);

    const togglePopup = async (username) => {
        if (!profileOpen) {
            await fetchUser(username);
        } else {
            setFriendProfile(null);
        }

        setProfileOpen(!profileOpen);
    };

    const startChat = (username) => {
        setChatName(username);
        getUserId(username);
    };


    const acceptRequest = (username) => {
        addFriend(username);
    };

    return (
        <div className="chatContainer">



            <div className="friendListContainer">
                <PeopleIcon />
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {friendList.map((friend) => (
                        <ListItem
                            key={friend.username} // Use friend.username for unique keys
                            disableGutters
                            secondaryAction={
                                friend.accepted ? (
                                    <IconButton aria-label="chat" onClick={() => startChat(friend.username)}>
                                        <CommentIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton aria-label="request" onClick={() => acceptRequest(friend.username)}>
                                        <CheckIcon />
                                    </IconButton>
                                )
                            }
                        >

                            <ListItemText primary={friend.username} onClick={() => togglePopup(friend.username)} />

                        </ListItem>

                    ))}
                </List>

                {profileOpen && friendProfile && (
                    <Modal
                        open={profileOpen}
                        onClose={togglePopup}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box className="modal-box">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Profile
                            </Typography>
                            <Typography variant="body1">
                                <strong>Email:</strong> {friendProfile.email}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Username:</strong> {friendProfile.username}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Age:</strong> {friendProfile.age}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Description:</strong> {friendProfile.info}
                            </Typography>
                        </Box>
                    </Modal>
                )}



            </div>

            <div className='chatBoxContainer'>
                <ChatBox chatName={chatName} chatMembers={chatMembers} />
            </div>



        </div>
    );
};

export default FriendList;
