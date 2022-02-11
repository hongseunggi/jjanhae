import React from "react";
import styles from "./SelectingGame.module.css";
import { ReactComponent as Sendclock } from "../../../assets/icons/sendclock.svg";

const SelectingGame = (isSelecting) => {
    return (
        <div className={isSelecting ? `${styles.onSelectingGame} ${styles.selectingGame}` : styles.selectingGame}>
            <div className={styles.infoText}>참가자들이 키워드를 선정중입니다....<Sendclock className={styles.icon}/></div>
        </div>
    )
}

export default SelectingGame;