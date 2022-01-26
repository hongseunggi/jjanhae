import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { Container, Row, Col } from "react-bootstrap";
import style from "./RoomList.module.css";
import { Link } from "react-router-dom";
import { ReactComponent as Clock } from "../../assets/icons/clock.svg";
import { ReactComponent as Lock } from "../../assets/icons/lock.svg";

function RoomList(props) {
    let today = new Date();
    let start = today.getHours()+":"+today.getMinutes();
    if(today.getMinutes() <= 9 && today.getMinutes() >= 0){
        start = today.getHours()+":0"+today.getMinutes();
    }
    //let start = today.getHours()+":"+today.getMinutes();
    console.log(start);
    const rooms = [
        {drinkLimit : 0, title : "안녕하세요~", type : 1, description : "반가워요~!하하하하하하하하 재밌게 놀아용", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg"},
        {drinkLimit : 2, title : "안녕하세요~", type : 0, description : "반가워요~!", callStartTime : start, joinUserNum : 8, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/singapore.jpg"},
        {drinkLimit : 1, title : "안녕하세요~", type : 1, description : "반가워요~!", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/prague.jpg"},
        {drinkLimit : 1, title : "안녕하세요~", type : 1, description : "반가워요~!", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/amsterdam.jpg"},
        {drinkLimit : 0, title : "안녕하세요~", type : 1, description : "반가워요~!", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/moscow.jpg"},
        {drinkLimit : 0, title : "안녕하세요~", type : 1, description : "반가워요~!", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg"},
        {drinkLimit : 0, title : "안녕하세요~", type : 1, description : "반가워요~!", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg"},
    ];
    


    const renderDrinkLevel = (value) => {
        switch(value){
            case 0:
                return(<div className={style.roomlabel}>알쓰방</div>)
            case 1:
                return(<div className={style.roomlabel}>주당방</div>)
            case 2:
                return(<div className={style.roomlabel}>술고래방</div>)
        }
    }
    
    const renderJoinUser = (value) =>{
        if(value >= 8){
            return(<h3 className={style.fulluser}>8/8</h3>)
        }
        return(<h3 className={style.joinuser}>{value}/8</h3>)
    }

    const renderLock = (value) =>{
        if(value === 0){
            return(<Lock className={style.lock} width="20" height="20" 
            filter="invert(34%) sepia(54%) saturate(4911%) hue-rotate(327deg) brightness(100%) contrast(103%)" ></Lock>)
        }
        return(<Lock className={style.lock} width="20" height="20" 
        filter="invert(82%) sepia(33%) saturate(6059%) hue-rotate(128deg) brightness(98%) contrast(94%)" ></Lock>)
    }
    // useEffect(()=>{
    //     r
    // })
    return(
        <Container fluid={true} className={style.container}>
            <Row className={style.srow}>
            <Col className={style.searchbox}>
            
                <div className={style.searchdiv}>
                    <select className={style.select}>
                        <option>
                            전체보기
                        </option>
                        <option>
                            생성시간순
                        </option>
                        <option>
                            주량 높은순
                        </option>
                        <option>
                            주량 낮은순
                        </option>
                    </select>
                    <svg className={style.svg}
                        width="15"
                        height="15"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10 14L16 6H4L10 14Z"
                            fill="#ffff"
                        /></svg>
                    <input className={style.search}></input>
                    <button className={style.sbutton}>검색</button>
                </div>
                
            </Col>
            </Row>
            <Row>
                <div style={{
                    height : "20px"
                }}></div>
            </Row>
            <Row className={style.list}>
                {rooms.map((room, index)=>{
                    console.log(room, "room");
                    return(<Col key={index} md = {4}>
                                <div className={style.room}>
                                    <div className={style.roomthumb} style={{
                                                backgroundImage: `url(${room.thumbnail})`,
                                                backgroundSize: "cover",
                                            }}>
                                        {renderDrinkLevel(room.drinkLimit)}
                                    </div>
                                    <div className={style.about}>
                                        <h3>{room.title}</h3>
                                        {renderLock(room.type)}
                                        <br></br><br></br><br></br>
                                        <h5>{room.description}</h5>
                                    </div>
                                    <div className={style.footer}>
                                        <Clock  fill="#EEE" width="20" height="20" 
                                            filter="invert(100%) sepia(8%) saturate(101%) hue-rotate(221deg) brightness(113%) contrast(87%)" 
                                            className={style.clock}/>
                                        <h5>{room.callStartTime}~</h5>
                                        {renderJoinUser(room.joinUserNum)}
                                    </div>
                                </div>
                            </Col>)

                })}
            </Row>
        </Container>
    )
}

export default RoomList;
