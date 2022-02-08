import { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import style from "./RoomList.module.css";
import RoomApi from "../../api/RoomApi";
import SettingModalContainer from "./SettingModalContainer";

function RoomList() {


    const [Loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [endCheck, setEndCheck] = useState(false);
    const [offsetCount, setOffset] = useState(0);
    const [rooms, setRooms] = useState([]);
    const {getRoomListResult} = RoomApi;

    const offsetCountRef = useRef(offsetCount);
    offsetCountRef.current = offsetCount;

    const endCheckRef = useRef(endCheck);
    endCheckRef.current = endCheck;

    const [target, setTarget] = useState(null);

    const loadItem = async () => {
        if(endCheckRef.current){
            setLoading(false);
        }
        if(!endCheckRef.current){
            setIsLoaded(true);
            setLoading(true);
            console.log(offsetCountRef.current);
            let body = {
                paging : {
                    hasNext : "T",
                    limit : 6,
                    offset : offsetCountRef.current,
                },
                sort : "all",
                order : ""
            }
            const {data} = await getRoomListResult(body);
            if(data.content.length === 0){
                setEndCheck(true);
                return;
            }

            setRooms((prevState)=>{
                return [...prevState, ...data.content]
            });

            setOffset(offsetCountRef.current+6);
            setTimeout(()=>{
                setLoading(false);
            },1500);
            setIsLoaded(false);
        } 
    };

    const onIntersect = async ([entry], observer) => {
        if (entry.isIntersecting && !isLoaded) {
            observer.unobserve(entry.target);
            await loadItem();
            observer.observe(entry.target);
        }
    };

    useEffect(() => {
        let observer;
        if (target) {
            observer = new IntersectionObserver(onIntersect, {
            threshold: 0.4,
            });
            observer.observe(target);
        }

        return () => observer && observer.disconnect();

    }, [target  ]);
    


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
                            fillRule="evenodd"
                            clipRule="evenodd"
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
                <div ref={setTarget} style={{
                    width: "100vw",
                    height: "1px",
                }}>
                    {isLoaded}
                </div>
            </Row>
        </Container>
        
    )
}

export default RoomList;
