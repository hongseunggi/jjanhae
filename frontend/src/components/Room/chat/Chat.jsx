import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "./Chat.module.css";
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Send from '@material-ui/icons/Send';
import { Tooltip } from '@material-ui/core';


const Chat = (props) => {

    console.log(props.chatDisplay);
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState('');
    
    const chatScroll = useRef();

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    useEffect (() => {
        props.user.getStreamManager().stream.session.on('single:chat', (event) => {
            const data = JSON.parse(event.data);
            let messageListData = messageList;
            messageListData.push({conndectionId:event.from.conndectionId, nickname:data.nickname, message : data.message});
            const document = window.document;
            setTimeout(() => {
                const userImg = document.getElementById('userImg-' + (messageListData.length - 1));
                const video = document.getElementById('video-' + data.streamId);
                const avatar = userImg.getContext('2d');
                avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
                props.messageReceived();
            }, 50);
            setMessageList(messageListData);
            scrollToBottom();
        });
    }, []);

    const handlePressKey = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const sendMessage = () => {
        console.log(message);
        if(props.user && message) {
            let messageData = message.replace(/ +(?= )/g, '');
            if (message !== '' && message !== ' ') {
                const data = {message : messageData, nickname : props.user.getNickname(),streamId: props.user.getStreamManager().stream.streamId }
                props.user.getStreamManager().stream.session.signal({
                    data: JSON.stringify(data),
                    type: 'chat',
                });
            }
        }
        setMessage('');
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            try{
                chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
            } catch(error) {
                console.log(error);
            }
        }, 20);
    }

    const close = () => {
        props.close(undefined);
    };



    return(
        <>
        <div className={styles.chatContainer}>
            {/* <div className={`${styles.chatComponent} ${styles[props.chatDisplay]}`}> */}
            <div className={styles.chatComponent}>
                <div className={styles.chatToolbar}>
                    <span>{props.user.getStreamManager().stream.session.sessionId} - CHAT</span>
                    <IconButton id="closeButton" onClick={()=> close()}>
                        <HighlightOff color="secondary" />
                    </IconButton>
                </div>
                <div className={styles['message-wrap']} ref={chatScroll}>
                    {messageList.map((data, i) => (
                        <div
                        key = {i}
                        className={`${'message' + (data.connectionId !== props.user.getConnectionId() ? ' left' : ' right')}${styles.remoteUsers}`}
                        >
                        <canvas id={'userImg-' + i} width="60" height="60"  className={styles['user-img']}/>
                            <div className={styles['msg-detail']}>
                                <div className={styles['msg-info']}>
                                    <p>{data.nickname}</p>
                                </div>
                                <div className={styles['msg-content']}>
                                    <span className={styles.triangle}/>
                                        <p className={styles.text}>{data.message}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.messageInput}>
                    <input
                        placeholder="메세지를 입력하세요"
                        id="chatInput"
                        value={message}
                        onChange={handleChange}
                        onKeyPress={handlePressKey}
                    />
                    <Tooltip title="메세지를 입력하세요">
                        <Fab size="small" id="sendButton" onClick={sendMessage}>
                            <Send/>
                        </Fab>
                    </Tooltip>
                </div>
            </div>
        </div>
        </>
    )
};

export default Chat;