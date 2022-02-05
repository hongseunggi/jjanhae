import { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import style from "./RoomList.module.css";
import RoomApi from "../../api/RoomApi";
import SettingModalContainer from "./SettingModalContainer";
import LoadingSpinner from "../Modals/LoadingSpinner";

function RoomList() {

    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [endCheck, setEndCheck] = useState(false);
    const [offsetCount, setOffset] = useState(0);
    const [order , setOrder] = useState("desc");
    const [sort, setSort] = useState("createdAt");
    const [rooms, setRooms] = useState([]);
    const {getRoomListResult} = RoomApi;

    const offsetCountRef = useRef(offsetCount);
    offsetCountRef.current = offsetCount;

    const endCheckRef = useRef(endCheck);
    endCheckRef.current = endCheck;

    const orderRef = useRef(order);
    orderRef.current = order;

    const sortRef = useRef(sort);
    sortRef.current = sort;

    const [target, setTarget] = useState(null);

    const splitOrderSort = (e) =>{
        e.preventDefault();
        if(e.target.value === "all"){
            setEndCheck(false);
            setRooms([]);
            setSort("all");
            setOrder("");
            setOffset(0);
        }
        else{
            console.log("???!@@#!@#!");
            let splitstr = e.target.value.split(" ");
            console.log(splitstr);
            setEndCheck(false);
            setRooms([]);
            setSort(splitstr[0]);
            setOrder(splitstr[1]);
            setOffset(0);
        }
    }

    const loadItem = async () => {
        if(!endCheckRef.current){
            setLoading(true);
            setTimeout(()=>{
                setLoading(false);
            }, 1500);
            setIsLoaded(true);
            
            let body = {
                paging : {
                    hasNext : "T",
                    limit : 6,
                    offset : offsetCountRef.current,
                },
                sort : sortRef.current,
                order : orderRef.current
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
    const showRoom = () => {
        return (rooms.map((room, index)=>{
                <Col key={index} md = {4}>
                    <SettingModalContainer info = {room}/>                         
                </Col>
        }))
    }

    useEffect(() => {
        let observer;
        if (target) {
            observer = new IntersectionObserver(onIntersect, {
            threshold: 0.2,
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
                    <select className={style.select} onChange={splitOrderSort}>
                        <option value="createdAt desc">
                            최근생성순
                        </option>
                        <option value="createdAt asc">
                            오래된 생성순
                        </option>
                        <option value="drinkLimit desc">
                            주량 높은순
                        </option>
                        <option value="drinkLimit asc">
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
            
            <Row className={style.list} style={{

            }}>
                {rooms.map((room, index)=>{
                    return(
                        <Col key={index} md = {4}>
                            <SettingModalContainer info = {room}/>                         
                        </Col>)
                })}
                <div ref={setTarget} style={{
                    width: "100vw",
                    height: "5px",
                }}>
                    {console.log(isLoaded)}
                </div>
                {loading ? <LoadingSpinner></LoadingSpinner> : null}
            </Row>
        </Container>
        
    )
}

export default RoomList;
