import React, { useEffect, useState, useRef } from "react";
import styles from "./YangGameComponent.module.css";
import Keyword from "../../Modals/Game/Keyword";


function YangGameComponent({ sessionId, user, targetSubscriber, isSelecting }) {

  const color = [
    "#adeac9",
    "#ff98ad",
    "#abece7",
    "#ffff7f",
    "#FFC0CB",
    "#FFEB46",
    "#EE82EE",
    "#B2FA5C",
    "#a3c9f0",
    "#e3ae64",
    "#a1e884",
    "#84e8c5",
    "#ceb1e3",
    "#e3b1d2",
    "#e3b1b1",
    "#d4ff8f",
    "#98ff8f",
    "#b6f0db",
    "#b6e3f0",
    "#f288e9",
  ];

  const [keyword, setKeyword] = useState("");
  const [subscriberkeyword, setSubscriberKeyword] = useState("");
  const [bgcolor, setBgcolor] = useState("");
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState([]);
  const [myNickname, setMyNickname] = useState("");
  const [allSet, setAllSet] = useState(false);
  const [gameStatus, setGameStatus] = useState("0");
  const [streamId, setStreamId] = useState("")
  const [targetId, setTargetId] = useState("");
  const [targetGameName, setTargetGameName] = useState("");
  const [index, setIndex] = useState("1");
  const [keywordInputModal,setKeywordInputModal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [modalMode, setModalMode]= useState("assign");

  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    for (let i = 0; i < nickname.length; i++) {
      if (user.connectionId === nickname[i].connectionId) {
        setMyNickname(nickname[i].keyword);
      }
    }
  }, [nickname]);

  const handleChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSubscriberChange = (event) => {
    setSubscriberKeyword(event.target.value);
  };

  const submitKeyword = () => {
    if (keyword !== "" && keyword !== " ") {
      const data = {
        streamId: user.connectionId,
        sessionId: sessionId,
        gameStatus: 2,
        gameId: 1,
        gamename: keyword,
      };
      user.getStreamManager().stream.session.signal({
        data: JSON.stringify(data),
        type: "game",
      });
    }
  };

  
  const submitSubscriberKeyword = () => {
    // console.log(subscriberkeyword);
    // if (subscriberkeyword !== "" && subscriberkeyword !== " ") {
    //   const data = {
    //     streamId: user.connectionId,
    //     sessionId: sessionId,
    //     gameStatus: 1,
    //     gameId: 1,
    //     gamename: subscriberkeyword,
    //   };
    //   user.getStreamManager().stream.session.signal({
    //     data: JSON.stringify(data),
    //     type: "game",
    //   });
    // }
  };

  const giveGamename = (data) => {
    console.log(streamId);
    console.log(targetId);
    console.log(data);
    console.log(index);
    const senddata = {
      streamId: streamId,
      gameStatus: 1,
      gameId: 1,
      gamename : data,
      index:index,
    }
    user.getStreamManager().stream.session.signal({
      data: JSON.stringify(senddata),
      type: "game",
    });
  }

  const checkMyAnswer = (data) => {
    const senddata = {
      streamId: streamId,
      gameStatus: 2,
      gameId: 1,
      gamename : data,
    }
    user.getStreamManager().stream.session.signal({
      data: JSON.stringify(senddata),
      type: "game",
    });
  }

  useEffect(()=> {
    if(sessionId!==undefined) {
      const data={
        gameStatus : 0,
        gameId : 1,
      }
      user.getStreamManager().stream.session.signal({
        type : "game",
        data : JSON.stringify(data), 
      });
    }
    
  }, []);


  useEffect(() => {
    let index = Math.floor(Math.random() * 21);
    setBgcolor(color[index]);
  }, []);

  useEffect(() => {
    if (targetSubscriber !== undefined) {
      // console.log(targetSubscriber);
      setTargetId(targetSubscriber.connectionId);
    }
  }, [targetSubscriber]);

  useEffect(() => {
    setUserId(user.connectionId);
  }, [user]);

  useEffect(() => {
    //back으로 부터 받는 data처리
    user.getStreamManager().stream.session.on("signal:game", (event) => {
      closeKeywordInputModal();
      const data = event.data;
      console.log(data.streamId);
      console.log(data.targetId);
      console.log(data.index);
      console.log(user.getStreamManager().stream.streamId);
      //초기요청 응답

      //내가 키워드를 정해줄 차례라면
      if(sessionId!==undefined) {
      console.log(sessionId);
      if(data.gameStatus===1) {

        if(data.streamId===user.getStreamManager().stream.streamId) {
          console.log("my turn");
          //상대방 키워드 입력해줄 모달 띄우기
          setStreamId(data.streamId);
          setTargetId(data.targetId);
          setModalMode("assign");
          openKeywordInputModal();
          if(data.index!==undefined&&data.index!=="") {
            setIndex(data.index);
          }
          //내가 정해줄 차례가 아니라면
        } else {
          console.log("not my turn");
          setModalMode("wait");
          openKeywordInputModal();
        }
      }else if(data.gameStatus===2) {
        if(data.answerYn!==undefined&&data.answerYn.index!=="") {
          if(data.answerYn==="Y") {
            setModalMode("correct");
            openKeywordInputModal();
          }
        }else {
          setModalMode("answer");
          closeKeywordInputModal();
          console.log("키워드 설정 완료");
        }
      }
    }
    });
  }, []);

  const openKeywordInputModal = () => {
    setKeywordInputModal(true);
  }
  const closeKeywordInputModal = () => {
    setKeywordInputModal(false);
  }
  const confirmMyAnswer = (data) => {
    closeKeywordInputModal();
    setAnswer(data);
    //게임 정답 맞추는 api호출
    checkMyAnswer(data);
  }
  const confirmTargetGameName = (data) => {
    closeKeywordInputModal();
    setTargetGameName(data);
    giveGamename(data);
    //target gamename 지정해주는 api호출
  }


  return (
    <div className={styles.yangGame}>
    <Keyword
    open = {keywordInputModal}
    close = {closeKeywordInputModal}
    confirmMyAnswer = {confirmMyAnswer}
    confirmTargetGameName = {confirmTargetGameName}
    mode = {modalMode}
    />
      {sessionId ? (
        <div className={styles.postitInput}>
          <div 
            className={styles.keyword} 
            onClick = {openKeywordInputModal}>당신의 키워드는?</div>
        </div>
      ) : (
        <div
          className={styles.postitInput}
          style={{ backgroundColor: `${bgcolor}` }}
        >
            <input
              className={styles.subKeyword}
              placeholder={"키워드 정해주세요"}
              onChange={handleSubscriberChange}
              onKeyPress={submitSubscriberKeyword}
              name={user.nickname}
            ></input>
        </div>
          )};
    </div>
  );
}

export default YangGameComponent;
