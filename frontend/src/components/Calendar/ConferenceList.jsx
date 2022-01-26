import React, { useState } from "react";
import styles from "./ConferenceList.module.css";

const ConferenceList = ({ open, onClose }) => {


    const [partyDetail, setPartyDetail] = useState([
        {time : "17:00", title:"놀자!"},
        {time : "19:00", title:"술먹을사람~!"},
        {time : "22:00", title:"안녕~!"},
    ]);

    return (
        <>
            <div className={styles.listForm}>
                
            </div>
        </>
    )
}

export default ConferenceList;