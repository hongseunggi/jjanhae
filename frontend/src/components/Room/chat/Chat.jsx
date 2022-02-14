import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "./Chat.module.css";

import { ReactComponent as SendIcon } from "../../../assets/icons/send.svg";

const Chat = (props) => {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const [continueGame, setContinueGame] = useState(false);
  const chatScroll = useRef();
  const handleChange = (event) => {
    setMessage(event.target.value);
  };
  console.log("chat render");
  console.log(props.user);
  useEffect(() => {
    //console.log("here");
    if(props.mode==='game3'){
      props.user.getStreamManager().stream.session.on("signal:game", (event) => {
        const data = event.data;
        console.log(data);
        let messageListData = messageList;
        if(continueGame && data.gameStatus === 2){
          messageListData.push({
            connectionId: "SYSTEM",
            nickname : "SYSTEM",
            message : "UP DOWN 게임 시작합니다!!"
          })
        }
        else if(data.gameStatus === 3){
          messageListData.push({
            connectionId: "SYSTEM",
            nickname : "SYSTEM",
            message : "UP DOWN 게임 종료!!"
          })
        }
        else {
            messageListData.push({
              connectionId: data.streamId,
              nickname : data.nickname,
              message : data.number
            })
            // if()
            messageListData.push({
              connectionId : "SYSTEM",
              nickname : "SYSTEM",
              message : data.updown === "same" ? `${data.nickname}님 정답입니다!` 
                                                  : data.updown === "up" ? "틀렸습니다! UP!"
                                                      : "틀렸습니다! DOWN!",
            })
            if(data.updown === "same"){
              messageListData.push({
                connectionId : "SYSTEM",
                nickname : "SYSTEM",
                message : "이어서 하시겠습니까 ? (Y/N)"
              })
            }
        }
        setMessageList([...messageListData])
        if(data.updown === "same") setContinueGame(!continueGame);
        if(data.gameStatus === 3) setContinueGame(!continueGame);
        //console.log(messageList);
        scrollToBottom();
      });
    }
    else{
      props.user.getStreamManager().stream.session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        //console.log(event);
        let messageListData = messageList;
        messageListData.push({
          connectionId: event.from.connectionId,
          nickname: data.nickname,
          message: data.message,
        });
        setMessageList([...messageListData]);
        //console.log(messageList);
        scrollToBottom();
      });
    }
  }, []);

  useEffect(() => {
    // //console.log(messageList);
  }, [messageList]);

  const handlePressKey = (event) => {
    if (event.key === "Enter" && props.mode === "game3") {
      sendAnswer();
    }
    else if(event.key === "Enter" && props.mode != "game3"){
      sendMessage();
    }
  };

  const sendMessage = () => {
    //console.log("chat" + message);
    if (props.user && message) {
      let messageData = message.replace(/ +(?= )/g, "");
      if (messageData !== "" && messageData !== " ") {
        const data = {
          message: messageData,
          nickname: props.user.getNickname(),
          streamId: props.user.getStreamManager().stream.streamId,
        };
        //console.log("chat" + data);
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
    setMessage("");
  };
  const sendAnswer= () => {
    //console.log("chat" + message);
    if (props.user && message) {
      let messageData = message.replace(/ +(?= )/g, "");
      console.log(messageData, "?QA?AS?S?S?S?S?S?S");
      if(continueGame){
        messageData = messageData.toUpperCase();
        if(messageData === "Y" || messageData === "O" || messageData === "0" || messageData === "OK" || messageData === "YES"){
          const data = {
            gameStatus : 1,
            gameId : 3,
          }
          props.user.getStreamManager().stream.session.signal({
            type : "game",
            data : JSON.stringify(data)
          })
        }
        else if(messageData === "N" || messageData === "X" || messageData === "NO"){
          const data = {
            gameStatus : 3,
            gameId : 3,
          }
          props.user.getStreamManager().stream.session.signal({
            type : "game",
            data : JSON.stringify(data)
          })
        }
        else {
          let messageListData = messageList;
          messageListData.push({
            connectionId : "SYSTEM",
            nickname : "SYSTEM",
            message : "형식에 맞게 다시 입력해주세요 (Y/N)"
          })
          setMessageList([...messageListData])
        }
      }
      else if (!continueGame && messageData !== "" && messageData !== " ") {
        const data = {
          gameStatus: 2,
          number : messageData*1,
          nickname : props.user.getNickname(),
          gameId: 3,
          streamId : props.user.connectionId
        };
        //console.log("chat" + data);
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "game",
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
        //console.log(error);
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
              {/* <canvas
                id={"userImg-" + i}
                width="60"
                height="60"
                className={styles["user-img"]}
              /> */}
              {data.nickname === "SYSTEM" ? (
                <div className={styles["msg-detail"]}>
                <div className={styles["msg-system"]}>
                  <p className={styles.system}>{data.nickname}</p>
                </div>
                <div className={styles["msg-sysmessage"]}>
                  <p className={styles.text}>{data.message}</p>
                </div>
              </div>

              ) : (

                <div className={styles["msg-detail"]}>
                <div className={styles["msg-info"]}>
                  <p className={styles.nickname}>{data.nickname}</p>
                </div>
                <div className={styles["msg-content"]}>
                  <p className={styles.text}>{data.message}</p>
                </div>
                </div>
              )}
              
            </div>
          ))}
        </div>

        {props.mode==='game3' ? (<div className={styles.messageInput}>
          <input
            placeholder="정답을 입력하세요"
            id="chatInput"
            value={message}
            onChange={handleChange}
            onKeyPress={handlePressKey}
            autoComplete="off"
          />
          {/* <Tooltip title="전송"> */}
          <div className={styles.sendIcon}>
            <SendIcon className={styles.sendButton} onClick={sendAnswer} />
          </div>
          {/* </Tooltip> */}
        </div>):(<div className={styles.messageInput}>
          <input
            placeholder="메세지를 입력하세요"
            id="chatInput"
            value={message}
            onChange={handleChange}
            onKeyPress={handlePressKey}
            autoComplete="off"
          />
          {/* <Tooltip title="전송"> */}
          <div className={styles.sendIcon}>
            <SendIcon className={styles.sendButton} onClick={sendMessage} />
          </div>
          {/* </Tooltip> */}
        </div>)}
      </div>
    </>
  );
};

export default Chat;