import { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import style from "./RoomList.module.css";
import RoomApi from "../../api/RoomApi";
import SettingModalContainer from "./SettingModalContainer";
import LoadingSpinner from "../Modals/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function RoomList() {
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [endCheck, setEndCheck] = useState(false);
  const [offsetCount, setOffset] = useState(0);
  const [order, setOrder] = useState("desc");
  const [sort, setSort] = useState("createdAt");
  const [rooms, setRooms] = useState([]);
  const [keyword, setKeyword] = useState("");
  console.log("room list render");
  const { getRoomListResult, getRoomSearchResult } = RoomApi;
  const navigate = useNavigate();
  const offsetCountRef = useRef(offsetCount);
  offsetCountRef.current = offsetCount;

  const endCheckRef = useRef(endCheck);
  endCheckRef.current = endCheck;

  const orderRef = useRef(order);
  orderRef.current = order;

  const sortRef = useRef(sort);
  sortRef.current = sort;

  const [target, setTarget] = useState(null);

  const keywordHandler = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };

  const sendKeyword = async () => {
    setLoading(true);
    const { data } = await getRoomSearchResult(keyword);
    setRooms(data.content);
    setEndCheck(true);
    // setTimeout(() => {
      setLoading(false);
    // }, 1000);
  };
  const sendKeywordEnter = async (e) => {
    if (e.code === "Enter") {
      setLoading(true);
      const { data } = await getRoomSearchResult(keyword);
      setRooms(data.content);
      setEndCheck(true);
      // setTimeout(() => {
        setLoading(false);
      // }, 1000);
    }
  };

  const splitOrderSort = (e) => {
    e.preventDefault();

    let splitstr = e.target.value.split(" ");
    setKeyword("");
    setEndCheck(false);
    setRooms([]);
    setSort(splitstr[0]);
    setOrder(splitstr[1]);
    setOffset(0);
  };

  const loadItem = async () => {
    if (!endCheckRef.current) {
      setLoading(true);
      // setTimeout(() => {
        setLoading(false);
      // }, 1500);
      setIsLoaded(true);

      let body = {
        sort: sortRef.current,
        order: orderRef.current,
        limit: 6,
        offset: offsetCountRef.current,
      };
      const { data } = await getRoomListResult(body);
      if (data.content.length === 0) {
        setEndCheck(true);
        return;
      }

      setRooms((prevState) => {
        return [...prevState, ...data.content];
      });

      setOffset(offsetCountRef.current + 6);

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
    if(axios.defaults.headers.Authorization === undefined){

      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        console.log("실행됩니다.");
        axios.defaults.headers.Authorization =
          "Bearer " + sessionStorage.getItem("accessToken");
        console.log(axios.defaults.headers.Authorization);
      }
      else{
        toast.error(
          <div className="hi" style={{ width: "350px" }}>
            로그인 후 이용가능 합니다. 로그인 해주세요
          </div>,
          {
            position: toast.POSITION.TOP_CENTER,
            role: "alert",
          }
        );
        navigate("/user/login");
        
      }
    }
    let observer;
    if (target) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.2,
      });
      observer.observe(target);
    }

    return () => observer && observer.disconnect();
  }, [target]);

  return (
    <Container fluid={true} className={style.container}>
      <Row className={style.srow}>
        <Col className={style.searchbox}>
          <div className={style.searchdiv}>
            <select className={style.select} onChange={splitOrderSort}>
              <option value="createdAt desc">최근생성순</option>
              <option value="createdAt asc">오래된 생성순</option>
              <option value="drinkLimit desc">주량 높은순</option>
              <option value="drinkLimit asc">주량 낮은순</option>
            </select>
            <svg
              className={style.svg}
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
              />
            </svg>
            <input
              className={style.search}
              value={keyword}
              onChange={keywordHandler}
              onKeyPress={sendKeywordEnter}
            ></input>
            <button className={style.sbutton} onClick={sendKeyword}>
              검색
            </button>
          </div>
        </Col>
      </Row>
      <Row>
        <div
          style={{
            height: "20px",
          }}
        ></div>
      </Row>

      <Row className={style.list} style={{}}>
        {rooms.length === 0 ? (
          <div className={style.emptyAlert}>
            <div>현재 진행중인 파티룸이 존재하지 않습니다.</div>
          </div>
        ) : null}
        {rooms.map((room, index) => {
          return (
            <Col key={index} md={4}>
              <SettingModalContainer info={room} />
            </Col>
          );
        })}
        <div
          ref={setTarget}
          style={{
            width: "100vw",
            height: "5px",
          }}
        >
          {/* {console.log(isLoaded)} */}
        </div>
        {loading ? <LoadingSpinner></LoadingSpinner> : null}
      </Row>
    </Container>
  );
}

export default RoomList;
