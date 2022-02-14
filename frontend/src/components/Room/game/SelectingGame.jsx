import React , {useEffect, useReducer, useState, useRef}from "react";
import styles from "./SelectingGame.module.css";
import { ReactComponent as Sendclock } from "../../../assets/icons/sendclock.svg";
import { ReactComponent as LetsGo } from "../../../assets/icons/letsgo.svg";
import { ReactComponent as Go } from "../../../assets/icons/go.svg";

const SelectingGame = (props) => {
    const { open, close, openStartPage, closeStartPage } = props;
    const [count, setCount] = useState(5);
    const countRef = useRef(count);
    countRef.current = count;


    // const showInfoPage = () => {
    //     const loop = setInterval(()=> {
    //         let flag=0;
    //         setCount((prev) => prev-1);
    //         flag++;
    //         console.log(count);
    //         if (countRef.current === 0) {
    //             //5초 지났으니까 키워드 입력 화면으로 돌아가야 한다 -> gameStart를 다시 false로 만들어줘야 한다
    //             finishStartPage.finishStartPage();
    //         }
    //         if(flag===4) clearInterval(loop)
    //     }, 1000);
    // }

    // useEffect(()=> {
    //     showInfoPage();
    // },[]);

    console.log(open);
    return (
        <div className={open ? `${styles.onSelectingGame} ${styles.selectingGame}` : styles.selectingGame}>
            {open ? (
             <div className={styles.infoText}>참가자들이 키워드를 선정중입니다....<Sendclock className={styles.sendClockIcon}/>
                <button onClick={close}>닫기</button>
             </div>
            ) : ( openStartPage ? (
        <div className={open ? `${styles.onInfoGame} ${styles.infoGame}` : styles.infoGame}>
             <div className={styles.infoText}>양세찬 게임을 시작하겠습니다~~~~~~! 키워드를 정해볼까요???
                <button onClick={closeStartPage} className={styles.goBtn}><Go className={styles.goIcon}/></button>
             </div>
        </div>
            ) : null
            ) }
        </div>
    );
};

export default SelectingGame;