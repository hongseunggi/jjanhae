import { Container, Row, Col } from "react-bootstrap";
import style from "./RoomList.module.css";

import SettingModalContainer from "./SettingModalContainer";

function RoomList() {
    let today = new Date();
    let start = today.getHours()+":"+today.getMinutes();
    if(today.getMinutes() <= 9 && today.getMinutes() >= 0){
        start = today.getHours()+":0"+today.getMinutes();
    }
    //let start = today.getHours()+":"+today.getMinutes();
    console.log(start);
    const rooms = [
        {drinkLimit : 0, title : "안녕하세요~", type : 1, description : "반가워요~!하하하하하하하하 재밌게 놀아용", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg"},
        {drinkLimit : 2, title : "반갑습니당!", type : 0, description : "반가워요~!", callStartTime : start, joinUserNum : 8, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/singapore.jpg"},
        {drinkLimit : 1, title : "재밌게 놀고 싶은 사람?", type : 1, description : "난 잘 못놀아...", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/prague.jpg"},
        {drinkLimit : 1, title : "이거 재밌나요?", type : 1, description : "처음 접속 했습니당", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/amsterdam.jpg"},
        {drinkLimit : 0, title : "안녕하세요~", type : 1, description : "반가워요~!", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/moscow.jpg"},
        {drinkLimit : 0, title : "안녕하세요~", type : 1, description : "반가워요~!", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg"},
        {drinkLimit : 0, title : "안녕하세요~", type : 1, description : "반가워요~!", callStartTime : start, joinUserNum : 5, thumbnail : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg"},
    ];
    
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
                    return(
                        <Col key={index} md = {4}>
                            <SettingModalContainer info = {room}/>                         
                        </Col>)
                })}
            </Row>
        </Container>
        
    )
}

export default RoomList;
