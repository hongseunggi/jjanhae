import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "./Chat.module.css";

import { ReactComponent as SendIcon } from "../../../assets/icons/send.svg";

const Chat = (props) => {
  const [messageList, setMessageList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [message, setMessage] = useState("");
  const [continueGame, setContinueGame] = useState(false);
  const [checkMode, setCheck] = useState(false);
  const [mode, setMode] = useState("");
  const [idx, setIdx] = useState(0);
  const [currnetInput, setCurrentInput] = useState("");
  const [sub, setSub] = useState([]);
  const chatScroll = useRef();
  
  const handleChange = (event) => {
    setMessage(event.target.value);
  };
  const reset = useRef(messageList);
  reset.current = messageList;
  console.log("chat render", props.mode);
  console.log(props.user,"실행");
  if(props.mode === "game3" && mode !== "game3"){
    // const data2 = {
    //   gameStatus : 1,
    //   gameId : 3,
    //   index : 1
    // }
    // props.user.getStreamManager().stream.session.signal({
    //   data : JSON.stringify(data2),
    //   type : "game"
    // });
    setMode("game3");
  }
  else if(props.mode !== mode){
    // console.log("실행 입니다 초기화 제발 되라고 제발", messageList);

    setMode(props.mode);
  }
  
  useEffect(()=>{
    console.log(props.sub,"실행");
    setSub([...sub, props.sub]);
  },[props.sub]);
  useEffect(() => {
    console.log("실행 here");
    // console.log("chat render", initGame, continueGame);
      
    //   console.log("chat render", initGame, continueGame);
        props.user.getStreamManager().stream.session.on("signal:game", (event) => {
          const data = event.data;

          let messageListData = answerList;

          
          console.log("실행되고 있니?", data.streamId, props.user.getStreamManager(), data, props.sub, messageListData);
          if(data.gameStatus === 3 && data.updown === undefined){
            console.log("여기가 실행 되니?");
            props.exitgame();
          }


          if(data.updown){
            console.log("???????????????????????????????????실행");
            // messageListData.length = 0;
            messageListData.push({
              connectionId: data.curStreamId,
              nickname : data.nickname,
              message : data.number
            })
            messageListData.push({
              connectionId : "SYSTEM",
              nickname : "SYSTEM",
              message : data.updown === "same" ? `${data.nickname}님 정답입니다!` 
                                                  : data.updown === "up" ? "틀렸습니다! UP!"
                                                      : "틀렸습니다! DOWN!",
            })
            if(data.updown === "same"){
              console.log("실행되니 여기는?");
              messageListData.push({
                connectionId : "SYSTEM",
                nickname : "SYSTEM",
                message : "이어서 하시겠습니까 ? (Y/N)"
              })
              setContinueGame(true);
              setAnswerList([...messageListData])
              scrollToBottom();
              return;
            }
            if(props.user.getStreamManager().stream.streamId === data.nextStreamId){
              console.log("실ㅇ행실행")
              messageListData.push({
                connectionId: "SYSTEM",
                nickname : "SYSTEM",
                message : `${props.user.getNickname()}님 입력 차례입니다.`
              })
            }
            else{
              messageListData.push({
                connectionId: "SYSTEM",
                nickname : "SYSTEM",
                message : `다른 유저가 입력 중 입니다. 기다려주세요`
              })
            }
              
            
            scrollToBottom();
              setAnswerList([...messageListData])
              setCurrentInput(data.nextStreamId);
              setIdx(data.index);
          }
          else{
            console.log("??????????????????????????????????????????????여기ㄷ가 실행이라고?");
            messageListData.length = 0;
            messageListData.push({
              connectionId: "SYSTEM",
              nickname : "SYSTEM",
              message : "UP DOWN 게임 시작!!"
            })
            if(props.user.getStreamManager().stream.streamId === data.streamId){
              messageListData.push({
                connectionId: "SYSTEM",
                nickname : "SYSTEM",
                message : `${props.user.getNickname()}님 입력 차례입니다.`
              })
            }
            else{
              for(let i = 0; i < props.sub.length; i++){
                if(props.sub[i].getStreamManager().stream.streamId === data.streamId){
                  messageListData.push({
                    connectionId: "SYSTEM",
                    nickname : "SYSTEM",
                    message : `${props.sub[i].getNickname()}님 입력 차례입니다.`
                  })
                  break;
                }
              }
            }
            console.log(messageListData);
            setAnswerList([...messageListData]);
            setCurrentInput(data.streamId);
            setIdx(data.index);
            setContinueGame(false);
          }
              
          
        });
      
    

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
    
  },[]);

  useEffect(() => {
  }, [messageList]);
  useEffect(()=>{
    setMessageList(messageList => []);
    setMessage("");
    setContinueGame(false);
    setCheck(true);
    setMode("");
  }, [props.mode])

  const handlePressKey = (event) => {
    if (event.key === "Enter" && props.mode === "game3") {
      sendAnswer();
    }
    else if(event.key === "Enter" && props.mode != "game3"){
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (props.user && message) {
      let messageData = message.replace(/ +(?= )/g, "");
      if (messageData !== "" && messageData !== " ") {
        const data = {
          message: messageData,
          nickname: props.user.getNickname(),
          streamId: props.user.getStreamManager().stream.streamId,
        };
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
    setMessage("");
  };
  const sendAnswer= () => {
    if (props.user && message) {
      let messageData = message.replace(/ +(?= )/g, "");
        messageData = messageData.toUpperCase();

      if(continueGame){  
        console.log("????????실행?");
        if(messageData === "Y" || messageData === "O" || messageData === "0" || messageData === "OK" || messageData === "YES"){

          const data = {
            gameStatus : 1,
            gameId : 3,
            index : 1,
          }
          props.user.getStreamManager().stream.session.signal({
            type : "game",
            data : JSON.stringify(data)
          })
          setContinueGame(false);
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
          setContinueGame(false);
        }
        else {
          let messageListData = messageList;
          messageListData.push({
            connectionId : "SYSTEM",
            nickname : "SYSTEM",
            message : "형식에 맞게 다시 입력해주세요 (Y/N)"
          })
          setMessageList([...messageListData])
          scrollToBottom();
        }
      }
    else{
      if (messageData !== "" && messageData !== " " ) {
        const data = {
          gameStatus: 2,
          number : messageData*1,
          nickname : props.user.getNickname(),
          gameId: 3,
          index : idx,
          streamId : props.user.getStreamManager().stream.streamId
        };
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "game",
        });
        
      }
    }
    }
    setMessage("");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      try {
        chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
      } catch (error) {

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
         {props.mode === "game3" ? (answerList.map((data, i) => 
           
            (<div
              key={i}
              id="remoteUsers"

              className={
                data.connectionId !== props.user.getStreamManager().stream.streamId
                  ? styles["message-left"]
                  : styles["message-right"]
              }
            >
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
              
            </div>)
          
          )) : ( messageList.map((data, i) => (
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
          )))} 
          
        </div>

        {props.mode==='game3' ? (<div className={styles.messageInput}>
          {props.user.getStreamManager().stream.streamId === currnetInput ? (
            <>
            <input
            className={styles.defaultinput}
            placeholder="정답을 입력하세요"
            id="chatInput"
            value={message}
            onChange={handleChange}
            onKeyPress={handlePressKey}
            autoComplete="off"
            
          />
          <div className={styles.sendIcon}>
            <SendIcon className={styles.sendButton} onClick={sendAnswer} />
          </div>
          </>
          ) : (
            <input
            className={styles.disable}
            placeholder="차례를 기다려주세요"
            id="chatInput"
            value={message}
            onChange={handleChange}
            onKeyPress={handlePressKey}
            autoComplete="off"
            disabled={true}
          />
          )}
          
          {/* <Tooltip title="전송"> */}
          {/* <div className={styles.sendIcon}>
            <SendIcon className={styles.sendButton} onClick={sendAnswer} />
          </div> */}
          {/* </Tooltip> */}
        </div>):(<div className={styles.messageInput}>
          <input
            className={styles.defaultinput}
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