import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "./Chat.module.css";

import { ReactComponent as SendIcon } from "../../../assets/icons/send.svg";

const Chat = (props) => {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");

  const chatScroll = useRef();

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    console.log("here");
    props.user.getStreamManager().stream.session.on("signal:chat", (event) => {
      const data = JSON.parse(event.data);
      console.log(event);
      let messageListData = messageList;
      messageListData.push({
        connectionId: event.from.connectionId,
        nickname: data.nickname,
        message: data.message,
      });

      setMessageList([...messageListData]);
      console.log(messageList);
      scrollToBottom();
    });
  }, []);

  useEffect(() => {
    // console.log(messageList);
  }, [messageList]);

  const handlePressKey = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    console.log("chat" + message);
    if (props.user && message) {
      let messageData = message.replace(/ +(?= )/g, "");
      if (messageData !== "" && messageData !== " ") {
        const data = {
          message: messageData,
          nickname: props.user.getNickname(),
          streamId: props.user.getStreamManager().stream.streamId,
        };
        console.log("chat" + data);
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
    setMessage("");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      try {
        chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
      } catch (error) {
        console.log(error);
      }
    }, 20);
  };

  const close = () => {
    props.close(undefined);
  };

  return (
    <>
      <div className={styles.chatComponent}>
        <div className={styles.chatToolbar}>
          <span>채팅창</span>
        </div>
        <div className={styles["message-wrap"]} ref={chatScroll}>
          {messageList.map((data, i) => (
            <div
              key={i}
              id="remoteUsers"
              //   className={`${styles.message} `}
              className={
                data.connectionId !== props.user.getConnectionId()
                  ? styles["message-left"]
                  : styles["message-right"]
              }
            >
              <canvas
                id={"userImg-" + i}
                width="60"
                height="60"
                className={styles["user-img"]}
              />
              <div className={styles["msg-detail"]}>
                <div className={styles["msg-info"]}>
                  <p class={styles.nickname}>{data.nickname}</p>
                </div>
                <div className={styles["msg-content"]}>
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
            autocomplete="off"
          />
          {/* <Tooltip title="전송"> */}
          <div className={styles.sendIcon}>
            <SendIcon className={styles.sendButton} onClick={sendMessage} />
          </div>
          {/* </Tooltip> */}
        </div>
      </div>
    </>
  );
};

export default Chat;
