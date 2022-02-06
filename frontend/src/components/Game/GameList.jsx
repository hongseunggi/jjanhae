import React, { useState, useEffect } from "react";
import styles from "./GameList.module.css";
import { ReactComponent as GameIcon } from "../../assets/icons/game.svg";


const Keyword = (props) => {
    const {open, close} = props;
    const [game, setGame] = useState();

    const handleChange = (event) => {
        setGame(event.target.value);
    }

    const confirm = () => {
        console.log(game);
        close();
    }

    return (
        <div
        className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
      >
        {open ? (
          <section className={styles.modalForm}>
            <header>
            </header>
                <main className={styles.main}>
                <div className={styles.icon}>
                    <GameIcon className={styles.icon}/>
                </div>
                <div className={styles.gameListBorder}>
                <div className={styles.game}>
                        양세찬 게임
                    <input
                        value="yangGame"
                        type="radio"
                        checked={game === "yangGame"}
                        onChange={handleChange}
                        />
                </div>
                <div className={styles.game}>
                        금지어 게임
                    <input
                        value="forbiddenGame"
                        name="platform"
                        type="radio"
                        checked={game === "forbiddenGame"}
                        onChange={handleChange}
                        />
                </div>
                <div className={styles.game}>
                        노래 맞추기
                    <input
                        value="musicGame"
                        name="platform"
                        type="radio"
                        checked={game === "musicGame"}
                        onChange={handleChange}
                        />
                </div>
                <div className={styles.game}>
                        업다운
                    <input
                        value="updownGame"
                        name="platform"
                        type="radio"
                        checked={game === "updownGame"}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div className={styles.buttonBorder}>
                    <button className={styles.confirmBtn} onClick={confirm}>
                        {" "}
                        확인{" "}
                    </button>
                    <button className={styles.closeBtn} onClick={close}>
                        {" "}
                        취소{" "}
                    </button>
                </div>
                </main>
          </section>
        ) : null}
      </div>
    );
}

export default Keyword;