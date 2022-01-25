import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { Container, Row, Col } from "react-bootstrap";
import style from "./RoomList.module.css";
import { Link } from "react-router-dom";

function RoomList(props) {
    const rooms = [
        {drinkLimit : 0, title : "안녕하세요~", description : "반가워요~!"},
        {drinkLimit : 2, title : "안녕하세요~", description : "반가워요~!"},
        {drinkLimit : 1, title : "안녕하세요~", description : "반가워요~!"},
        {drinkLimit : 1, title : "안녕하세요~", description : "반가워요~!"},
        {drinkLimit : 0, title : "안녕하세요~", description : "반가워요~!"},
        {drinkLimit : 0, title : "안녕하세요~", description : "반가워요~!"},
        {drinkLimit : 0, title : "안녕하세요~", description : "반가워요~!"},
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

    // useEffect(()=>{
    //     r
    // })
    return(
        <Container fluid={true}>
            <Row >
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
            <Row className={style.list}>
                {rooms.map((room, index)=>{
                    console.log(room, "room");
                    return(<Col key={index} md = {4}>
                                <div className={style.room}>
                                    <div className={style.roomthumb}>
                                        {renderDrinkLevel(room.drinkLimit)}
                                        <img></img>
                                    </div>
                                    <div>
                                        <h1>{room.title}</h1>
                                        {room.description}
                                    </div>
                                </div>
                            </Col>)

                })}
            </Row>
        </Container>
    )
}

export default RoomList;
