import React, { useState, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FaceIcon from '@mui/icons-material/Face';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const ChatBox = (props) => {
    const [input, setInput] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [error, setError] = useState("");
    const [openChat, setOpenChat] = useState(false);
    const token = localStorage.getItem('token');
    const listRef = useRef(null);


    const createChat = async (chatMembers) => {
        try {
            const response = await fetch("http://localhost:5000/message/createchat", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ membersId: chatMembers }),
            });

            await response.json();
            getMessages(props.chatMembers);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const getMessages = async (chatMembers) => {
        try {
            const response = await fetch("http://localhost:5000/message/getmessages", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ membersId: chatMembers }),
            });

            const data = await response.json();
            toggleChat();
            setMessageList(data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const createMessage = async () => {
        try {
            const response = await fetch("http://localhost:5000/message/createmessage", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: props.chatMembers[0],
                    to: props.chatMembers[1],
                    message: input
                }),
            });

            await response.json();
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const handleChange = (event) => {
        setInput(event.target.value);

    }

    const sendMessage = async (event) => {
        event.preventDefault();
        const trimmedInput = input.trim();
        if (trimmedInput.length < 1 || trimmedInput.length > 140) {
            setError("Message must be between 1 and 140 characters");
            return;
        }
        setError("");
        await createMessage();
        setInput("");
        getMessages(props.chatMembers);
    }

    const toggleChat = () => {
        if ((props.chatMembers).length > 0) {
            setOpenChat(true);
        }
    };

    useEffect(() => {
        if (props.chatMembers.length > 1){
            createChat(props.chatMembers);
        }
        
    }, [props.chatMembers]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messageList]);

    return (
        <div className="chatBox">
            <div className="d-flex justify-content-center">
                {openChat ? (
                    <div className='miniProfile'>
                        <FaceIcon />
                        <p>{props.chatName}</p>
                    </div>
                ): <QuestionAnswerIcon />}


                <List
                    ref={listRef}
                    sx={{
                        width: '100%',
                        width: 360,
                        height: 300,
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        '& ul': { padding: 0 },
                    }}
                >
                    {Array.isArray(messageList) && messageList.length > 0 ? (
                        messageList.map((message, index) => (
                            <ListItem
                                key={index}
                                disableGutters
                                sx={{
                                    textAlign: message.from === props.chatMembers[0] ? 'right' : 'left',
                                }}
                            >
                                <ListItemText primary={message.message} />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No messages" />
                        </ListItem>
                    )}
                </List>

                <br />

                {openChat && (
                    <form onSubmit={sendMessage}>
                        <TextField
                            id="message-bar"
                            className="text"
                            value={input}
                            onChange={handleChange}
                            variant="outlined"
                            placeholder="Write message..."
                            size="small"
                            error={!!error}
                            helperText={error}
                        />
                        <IconButton type='submit' aria-label="send message">
                            <SendIcon />
                        </IconButton>
                    </form>
                )}

            </div>
        </div>
    );
};

export default ChatBox;

