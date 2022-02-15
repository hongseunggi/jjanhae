import React, { useEffect, useState } from "react";
import UserApi from "../../api/UserApi.js";
import ImgApi from "../../api/ImgApi.js";
import styles from "./Profile.module.css";
import editIcon from "../../assets/icons/edit.png";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { Link } from "react-router-dom";
import image1 from "../../assets/images/default1.png";
import image2 from "../../assets/images/default2.png";
import image3 from "../../assets/images/default3.png";
import image4 from "../../assets/images/default4.png";
import image5 from "../../assets/images/default5.png";
import image6 from "../../assets/images/default6.png";
import LoadingSpinner from "../Modals/LoadingSpinner/LoadingSpinner";
import CalendarPage from "../Calendar/CalendarPage";
import IntoRoom from "../Modals/RoomEnter/IntoRoom.jsx";
import Rankfriend from "../Modals/Rankfriend/Rankfriend.jsx";


const Profile = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [drink, setDrink] = useState("");
  const [drinkLimit, setDrinkLimit] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [myImg, setMyImg] = useState(image6);
  const [openModal, setOpenModal] = useState(false);
  const { getUserProfile, getUpdateProfileResult, getUpdateProfileImgResult } =
    UserApi;
  const { getImgUploadResult } = ImgApi;
  // 친구들을 특정하기 위한 값이 필요 ex) id
  const [friends, setFriends] = useState([
    // { name: "김정연", count: 5, image: image1 },
    // { name: "유소연", count: 4, image: image2 },
    // { name: "배하은", count: 3, image: image3 },
    // { name: "홍승기", count: 2, image: image4 },
    // { name: "송민수", count: 1, image: image5 },
  ]);
  const [loading, setLoading] = useState(false);
  const images = [image1, image2, image3, image4, image5];
  const handleEditMode = async (e) => {
    e.preventDefault();
    //console.log(name);
    setIsEdit((prev) => !prev);
    if (isEdit) {
      setLoading(true);
      let body = {
        name: name,
        drink: drink,
        drinkLimit: drinkLimit,
        birthday: {
          year: year * 1,
          month: month * 1,
          day: day * 1,
        },
      };
      const { data } = await getUpdateProfileResult(body);
    
      setTimeout(() => {
        setLoading(false);
      }, 1500);
      setName(data.name);
      setEmail(data.email);
      let ny = data.birthday.year;
      let nm = data.birthday.month;
      let nd = data.birthday.day;
      if (data.birthday.month < 9) nm = "0" + data.birthday.month;
      if (data.birthday.day < 9) nd = "0" + data.birthday.day;
      setYear(ny);
      setMonth(nm);
      setDay(nd);
      setId(data.userId);
      setDrink(data.drink);
      setDrinkLimit(data.drinkLimit);
    }
  };

  const imgInputhandler = async (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    console.log(formData);
    const { data } = await getImgUploadResult(formData);
    //console.log(data);
    setMyImg(data.url);
    const body = {
      imageUrl: data.url,
    };
    const result = await getUpdateProfileImgResult(body);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    //console.log(result);
  };

  const nameHandler = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };
  const drinkHandler = (e) => {
    e.preventDefault();
    setDrink(e.target.value);
  };
  const yearHandler = (e) => {
    e.preventDefault();
    setYear(e.target.value);
  };
  const monthHandler = (e) => {
    e.preventDefault();
    if (e.target.value < 9) setMonth("0" + e.target.value);
    else setMonth(e.target.value);
  };
  const dayHandler = (e) => {
    e.preventDefault();
    if (e.target.value < 9) setDay("0" + e.target.value);
    else setDay(e.target.value);
  };
  const drinkLimitHandler = (e) => {
    e.preventDefault();
    if (e.target.value < 0) {
      setDrinkLimit(0);
    } else setDrinkLimit(e.target.value);
  };
  // const showProfile = () =>{
  //   return ()
  // }

  useEffect(() => getProfile(), []);

  const getProfile = async () => {
    setLoading(true);
    const { data } = await getUserProfile();
    setTimeout(() => {
      setLoading(false);
    }, 700);
    //console.log(data);
    setName(data.name);
    setEmail(data.email);
    setFriends(data.friends);
    let year = data.birthday.year;
    let month = data.birthday.month;
    let day = data.birthday.day;
    if (data.birthday.month < 9) month = "0" + data.birthday.month;
    if (data.birthday.day < 9) day = "0" + data.birthday.day;
    if (data.imageUrl !== "default") setMyImg(data.imageUrl);
    setYear(year);
    setMonth(month);
    setDay(day);
    setId(data.userId);
    setDrink(data.drink);
    setDrinkLimit(data.drinkLimit);
  };
  const handleModal = (e) => {
    e.preventDefault();
    setOpenModal(!openModal);
  }
  return (
    <div>
      <div className={styles.profileForm}>
      {loading ? <LoadingSpinner></LoadingSpinner> : null}
      <main className={styles.profile}>
        <header className={styles.title}>
          <h1>{name}님의 프로필</h1>
        </header>
        <div className={styles.sections}>
        
          <section className={styles.userProfile}>
          
            <form className={styles.userInfoForm}>
              
              <div className={styles.profileRow}>
              
                <label htmlFor="input-img">
                  <img
                    className={styles.profileImg}
                    src={myImg}
                    alt="profile"
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <input
                  type="file"
                  id="input-img"
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  onChange={imgInputhandler}
                />
                <div
                  className={
                    isEdit
                      ? `${styles.userInfoName} ${styles.userInfoDataEdit}`
                      : styles.userInfoName
                  }
                >
                  <div>
                  <button className={styles.rank} onClick={handleModal}>
                      🏆
                  </button>
                  </div>
                  <label htmlFor="name">이름</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    disabled={!isEdit}
                    onChange={nameHandler}
                  />
                  
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.userInfoData}>
                  <label htmlFor="id">아이디</label>
                  <input id="id" type="text" value={id} disabled />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.userInfoData}>
                  <label htmlFor="email">이메일</label>
                  <input id="email" type="text" value={email} disabled />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div
                  className={
                    isEdit
                      ? `${styles.userInfoData} ${styles.userInfoDataEdit}`
                      : styles.userInfoData
                  }
                >
                  <label htmlFor="birthday">생년월일</label>
                  {isEdit ? (
                    <div>
                      <input
                        className={styles.editbirth}
                        type="text"
                        value={year * 1}
                        onChange={yearHandler}
                      ></input>
                      -
                      <input
                        className={styles.editbirth}
                        type="text"
                        value={month * 1}
                        onChange={monthHandler}
                      ></input>
                      -
                      <input
                        className={styles.editbirth}
                        type="text"
                        value={day * 1}
                        onChange={dayHandler}
                      ></input>
                    </div>
                  ) : (
                    <input
                      id="birthday"
                      type="text"
                      value={`${year}-${month}-${day}`}
                      disabled
                    />
                  )}
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputRowHalf}>
                  <div
                    className={
                      isEdit
                        ? `${styles.userInfoData} ${styles.userInfoDataEdit}`
                        : styles.userInfoData
                    }
                  >
                    <label htmlFor="drink">선호주종</label>
                    {isEdit ? (
                      <select onChange={drinkHandler} value={drink}>
                        <option value="소주">소주</option>
                        <option value="맥주">맥주</option>
                      </select>
                    ) : (
                      <input id="drink" type="text" value={drink} disabled />
                    )}
                  </div>
                </div>
                <div className={styles.inputRowHalf}>
                  <div
                    className={
                      isEdit
                        ? `${styles.userInfoData} ${styles.userInfoDataEdit}`
                        : styles.userInfoData
                    }
                  >
                    <label htmlFor="drinkLimit">주량</label>
                    {isEdit ? (
                      <input
                        autoComplete="off"
                        id="drinkLimit"
                        value={drinkLimit}
                        type="number"
                        placeholder="주량(병)"
                        onChange={drinkLimitHandler}
                      />
                    ) : (
                      <input
                        id="drinkLimit"
                        type="text"
                        value={drinkLimit}
                        disabled
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.editRow}>
                <button
                  type="submit"
                  onClick={handleEditMode}
                  className={styles.editBtn}
                >
                  <img src={editIcon} alt="edit" className={styles.editIcon} />
                </button>
              </div>
            </form>
            <div className={styles.calendar}> 
            {openModal ? <Rankfriend onClose={handleModal} friend = {friends}></Rankfriend> : null}
  
            <CalendarPage></CalendarPage>
          </div>
          </section>
          
          {/* <section className={styles.friendProfile}>
          {loading ? <LoadingSpinner></LoadingSpinner> : null}
            <div className={styles.friendTitle}>
            
              <h1 className={styles.mainTitle}>나와 함께한 친구들</h1>
              <span className={styles.subTitle}>
                (술자리 참여 횟수 기준 상위 5명)
              </span>
            </div>
            <div className={styles.friends}>
              {friends.map((friend, index) => (
                <div key={index} className={styles.friendInfo}>
                  {friend.imgurl === 'default' ? (
                    <img
                    className={styles.friendProfileImg}
                    src={images[index]}
                    alt="friend profile"
                  />

                  ) : (
                  <img
                    className={styles.friendProfileImg}
                    src={friend.imgurl}
                    alt="friend profile"
                  />

                  )}
                  
                  <div className={styles.friendData}>
                    <span>{friend.name}/</span>
                    <span>{friend.numberOf}회</span>
                  </div>
                </div>
              ))}
              {friends.map((friend, index) => {
                if(index > 3) return;
                else return (
                <div key={index} className={styles.friendInfo}>
                  {friend.imgurl === 'default' ? (
                    <img
                    className={styles.friendProfileImg}
                    src={images[index]}
                    alt="friend profile"
                  />

                  ) : (
                  <img
                    className={styles.friendProfileImg}
                    src={friend.imgurl}
                    alt="friend profile"
                  />

                  )}
                  
                  <div className={styles.friendData}>
                    <span>{friend.name}/</span>
                    <span>{friend.numberOf}회</span>
                  </div>
                </div>
              )})}
            </div>
          </section> */}
        </div>
      </main>
    </div>
    </div>
  );
};

export default Profile;
