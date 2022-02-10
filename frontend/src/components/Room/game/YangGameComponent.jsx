import React, {useEffect, useState}  from "react";
import styles from "./YangGameComponent.module.css";

function YangGameComponent({sessionId, user}) {
    // let color = Math.random()*0x000000;  
    // color = parseInt(color);   
    // color = color.toString(16); 
    // console.log(color);  

    const color =  ["#fff44f", "#bfff00", "#adeac9", "#ff98ad", "#abece7", "#ffff7f", "#FFC0CB", "#FFEB46", "#EE82EE", "#B2FA5C",
     "#a3c9f0", "#e6bcbc", "#e3ae64", "#a1e884", "#84e8c5", "#ceb1e3", "#e3b1d2", "#e3b1b1", "#d4ff8f", 
     "#98ff8f", "#b6f0db", "#b6e3f0",  "#f288e9"];
    
    const [keyword, setKeyword] = useState('');
    const [bgcolor, setBgcolor] = useState('');
    
    const handleChange = (event) => {
        setKeyword(event.target.value);
    }

    const submitKeyword = () => {
        console.log(keyword);
        if(keyword !=="" && keyword !== " ") {
            const data = {
                keyword : keyword,
                streamId : user.getStreamManager().stream.streamId,
            };
            user.getStreamManager().stream.session.signal({
                data: JSON.stringify(data),
                type : "game",
            });
        }
    }

    useEffect(()=>{
        let index = Math.floor(Math.random()*21);
        setBgcolor(color[index]);
    },[]);

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
                >
                </input>
            </div>
        ) : (
            <div className={styles.postit} style={{backgroundColor :`${bgcolor}`}}>
                <div className={styles.subKeyword}>양세찬</div>
            </div>
        )}
        </div>
    )
}

export default YangGameComponent;