import React, { useEffect, useState } from "react";
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

  
  //양게임 시작하면 바로 보내는 요청
  useEffect(() => {
    const initalData = {
      gameStatus: gameStatus,
      gameId: 1,
    };

    user.getStreamManager().stream.session.signal({
      data: JSON.stringify(initalData),
      type: "game",
    });
  }, [])

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

  const giveGamename = () => {
    const data = {
      streamId: user.connectionId,
      gameStatus: 1,
      gameId: 1,
      gamename : "테스트",
      index : 1,
    }
    user.getStreamManager().stream.session.signal({
      data: JSON.stringify(data),
      type: "game",
    });
  }

  const checkMyAnswer = () => {
    // const data = {
    //   streamId: user.connectionId,
    //   gameStatus: 2,
    //   gameId: 1,
    //   gamename : "테스트",
    // }
    // user.getStreamManager().stream.session.signal({
    //   data: JSON.stringify(data),
    //   type: "game",
    // });
  }

  // useEffect(() => {
  //   if(gameStatus===1) {
  //     const data = {
  //       streamId: user.sessionId,
  //       sessionId: sessionId,
  //       gameStatus: gameStatus ,
  //       gameId: 1,
  //       gamename:"테스트",
  //       index:1,
  //     };
      
  //     user.getStreamManager().stream.session.signal({
  //       data: JSON.stringify(data),
  //       type:"game"
  //    });
  //   }
  // }, [gameStatus]);

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
      const data = event.data;
      console.log(data.streamId);
      console.log(user);
      console.log(user.getStreamManager().stream.streamId);
      //초기요청 응답

      if(data.gameStatus===1) {
        //내가 키워드를 정해줄 차례라면
        if(data.streamId===user.getStreamManager().stream.streamId) {
          console.log("my turn");
          setTargetId(data.targetId);
          giveGamename();
        }
      }else if(data.gameStatus===2) {
        console.log("키워드 설정 완료");
      }

      // if (data.connectionId === user.connectionId) {
      //   //키워드 설정해줬을 시
      // } else {
      //   let nicknameList = [];
      //   nicknameList = nickname;
      //   nicknameList.push({
      //     connectionId: data.streamId,
      //     keyword: data.gamename,
      //   });
      //   setNickname([...nicknameList]);
      // }
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
    checkMyAnswer();
  }
  const confirmTargetGameName = (data) => {
    closeKeywordInputModal();
    setTargetGameName(data);
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
{/*           
          <input
            className={styles.keyword}
            value={keyword}
            placeholder={"당신의 키워드는?"}
            onClick = {openKeywordInputModal}
          ></input> */}
        </div>
      ) : (
        <div
          className={styles.postitInput}
          style={{ backgroundColor: `${bgcolor}` }}
        >
          {targetId === userId ? (
            <input
              className={styles.subKeyword}
              placeholder={"키워드 정해주세요"}
              onChange={handleSubscriberChange}
              onKeyPress={submitSubscriberKeyword}
            ></input>
          ) : (
            <div
              className={styles.postit}
              style={{ backgroundColor: `${bgcolor}` }}
            >
              {myNickname}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default YangGameComponent;
