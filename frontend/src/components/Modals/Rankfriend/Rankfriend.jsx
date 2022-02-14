import React, { useState } from "react";
import style from "./Rankfriend.module.css";
import UserModel from "../../models/user-model";
import VideoMicContext from "../../../contexts/VideoMicContext";
import { ReactComponent as Micx } from "../../../assets/icons/micx.svg";
import { ReactComponent as Mic } from "../../../assets/icons/mic.svg";
import { ReactComponent as Videox } from "../../../assets/icons/videox.svg";
import { ReactComponent as Video } from "../../../assets/icons/video.svg";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import RoomApi from "../../../api/RoomApi";
import image1 from "../../../assets/images/default1.png";
import image2 from "../../../assets/images/default2.png";
import image3 from "../../../assets/images/default3.png";
import image4 from "../../../assets/images/default4.png";
import image5 from "../../../assets/images/default5.png";
import image6 from "../../../assets/images/default6.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



function Rankfriend({ onClose, friend }) {

  const [label, setLabel] = useState([]);
  const [number, setNum] = useState([]);
  const [tab, setTab] = useState(0);
  const images = [image1, image2, image3, image4, image5, image6];
  useEffect(() => {
    let name = [];
    let num = [];
    // friend.pop();
    for(let i = 0; i < friend.length; i++){
      name.push(friend[i].name);
      num.push(friend[i].numberOf);
    }
    
    setLabel([...name]);
    setNum([...num]);
  },[]);
  const handletab = (value) =>{
    console.log("gldgod");
    setTab(value);
  }

  const stopEvent = (e) =>{
    e.stopPropagation();
  }

  const rendertab = (value) => {
    if((value >= 0 && value < 5) && friend[value]){
      return (<div className={style.ranklist}>
        <div className={style.imgbox}>
          {friend[value].imgurl === 'default' ? (<img src = {images[value]}></img>) : (<img src = {friend[value].imgurl}></img>)}

        </div>
        <div className={style.rankname}> 
          {friend[value].name}
        </div>
        <div className={style.numberOf}>
          {friend[value].numberOf}회🥇
        </div>
    </div>)
    } else if (!friend[value]){
      return (<div className={style.ranklist}>
        <div className={style.imgbox}>
            <div className={style.ranknull}>데이터가 없습니다😑</div>
        </div>
    </div>)
    }
  }

  return (
    <div className={`${style.openModal} ${style.modal}`} onClick={onClose}>
        <div className={style.chartmodalForm} onClick={stopEvent}>
        <button className={style.close} onClick={onClose}>
          X
        </button>
        <h2>Ranking🥇</h2>
        
        <div className={style.charbox}>
        <Bar data={
          {
            labels : label,
            datasets: [
              {
                label: '함께한 횟수',
                data : number,
                backgroundColor: ['rgba(44, 214, 128, 0.5)','rgba(65, 149, 204, 0.5)','rgba(200, 113, 91, 0.5)','rgba(255, 99, 132, 0.5)','rgba(0, 0, 0, 0.5)'],
              },
            ],

          }
        }
        options={{
          plugins : {
            title : {
              display : true,
              text : "함께한 횟수"
            },
            legend : {
              display : false
            }
          },
          scales: {
            xAxes : {
              grid : {
                lineWidth : 0
              }
            },
            yAxes : {
              grid : {
                lineWidth : 0
              }
            }
        },
          
        }}></Bar>
        </div>
        <div>
          <ul className={style.tabs}>
            <li className={`${tab === 0 ? style.active: ''}`} onClick={()=>handletab(0)}>
            Rank 🥇
            </li>
            <li className={`${tab === 1 ? style.active: ''}`} onClick={()=>handletab(1)}>
            Rank 🥈
            </li>
            <li className={`${tab === 2 ? style.active: ''}`} onClick={()=>handletab(2)}>
            Rank 🥉
            </li>
            <li className={`${tab === 3 ? style.active: ''}`} onClick={()=>handletab(3)}>
            Rank 😅
            </li>
            <li className={`${tab === 4 ? style.active: ''}`} onClick={()=>handletab(4)}>
            Rank 😂
            </li>
          </ul>
          {rendertab(tab)}
          
        </div>
      </div>
    </div>
  );
}

export default Rankfriend;
