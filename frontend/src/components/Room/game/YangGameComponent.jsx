import React, { useEffect, useState } from "react";
import styles from "./YangGameComponent.module.css";

function YangGameComponent({ sessionId, user, targetSubscriber, subscribers }) {
  console.log(user);
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
  const [targetId, setTargetId] = useState("");
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState([]);
  const [myNickname, setMyNickname] = useState("");
  const [isSelecting, setIsSelecting] = useState(true);

  useEffect(() => {
    for (let i = 0; i < nickname.length; i++) {
      if (user.connectionId === nickname[i].connectionId) {
        console.log(user);
        console.log(nickname[i]);
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
    console.log(keyword);
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
    console.log(subscriberkeyword);
    if (subscriberkeyword !== "" && subscriberkeyword !== " ") {
      const data = {
        streamId: user.connectionId,
        sessionId: sessionId,
        gameStatus: 1,
        gameId: 1,
        gamename: subscriberkeyword,
      };
      user.getStreamManager().stream.session.signal({
        data: JSON.stringify(data),
        type: "game",
      });
    }
  };

  useEffect(() => {
    //양게임 시작하면 바로 요청 보냄
    const initalData = {
      streamId: user.connectionId,
        sessionId: sessionId,
        gameStatus: 1,
        gameId: 1,
    };
    user.getStreamManager().stream.session.signal({
      data: JSON.stringify(initalData),
      type: "game",
    });


    console.log("here");
    user.getStreamManager().stream.session.on("signal:game", (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      //내 키워드 맞추고 받은 응답
      if (data.connectionId === user.connectionId) {
        console.log("정답맞추기 실행");
        //키워드 설정해줬을 시
      } else {
        console.log("키워드 정해주기 실행");
        let nicknameList = [];
        nicknameList = nickname;
        nicknameList.push({
          connectionId: data.streamId,
          keyword: data.gamename,
        });
        setNickname([...nicknameList]);
        console.log(nicknameList);
      }
    });
  }, []);

  useEffect(() => {
    let index = Math.floor(Math.random() * 21);
    setBgcolor(color[index]);
  }, []);

  useEffect(() => {
    if (targetSubscriber !== undefined) {
      console.log(targetSubscriber);
      setTargetId(targetSubscriber.connectionId);
    }
  }, [targetSubscriber]);

  useEffect(() => {
    setUserId(user.connectionId);
  }, [user]);

  console.log("targetId: " + targetId);

  return (
    <div className={styles.yangGame}>
      {sessionId ? (
        <div className={styles.postitInput}>
          <input
            className={styles.keyword}
            value={keyword}
            placeholder={"당신의 키워드는?"}
            onChange={handleChange}
            onKeyPress={submitKeyword}
          ></input>
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
