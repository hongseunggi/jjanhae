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
import LoadingSpinner from "../Modals/LoadingSpinner.jsx";

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

  const { getUserProfile, getUpdateProfileResult, getUpdateProfileImgResult } =
    UserApi;
  const { getImgUploadResult } = ImgApi;
  // 친구들을 특정하기 위한 값이 필요 ex) id
  const [friends, setFriends] = useState([
    { name: "김정연", count: 5, image: image1 },
    { name: "유소연", count: 4, image: image2 },
    { name: "배하은", count: 3, image: image3 },
    { name: "홍승기", count: 2, image: image4 },
    { name: "송민수", count: 1, image: image5 },
  ]);
  const [loading, setLoading] = useState(false);

  const handleEditMode = async (e) => {
    e.preventDefault();
    console.log(name);
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

    const { data } = await getImgUploadResult(formData);
    console.log(data);
    setMyImg(data.url);
    const body = {
      imageUrl: data.url,
    };
    const result = await getUpdateProfileImgResult(body);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    console.log(result);
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

  useEffect(async () => {
    setLoading(true);
    const { data } = await getUserProfile();
    setTimeout(() => {
      setLoading(false);
    }, 700);
    console.log(data);
    setName(data.name);
    setEmail(data.email);
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
  }, []);

  return (
    <div className={styles.profileForm}>
      <header className={styles.title}>
        <h1>{name}님의 프로필</h1>
      </header>
      <main className={styles.profile}>
        <section className={styles.userProfile}>
          {loading ? <LoadingSpinner></LoadingSpinner> : null}
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
                style={{ display: "none" }}
                onChange={imgInputhandler}
              />
              <div
                className={
                  isEdit
                    ? `${styles.userInfoData} ${styles.userInfoDataEdit}`
                    : styles.userInfoData
                }
              >
                <label htmlFor="name">이름</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  disabled={!isEdit}
                  onChange={nameHandler}
                />
              </div>
              <Link to="/user/calendar">
                <CalendarIcon width="40" height="40" />
              </Link>
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
        </section>

        <section className={styles.friendProfile}>
          <div className={styles.friendTitle}>
            <h1 className={styles.mainTitle}>나와 함께한 친구들</h1>
            <span className={styles.subTitle}>
              (술자리 참여 횟수 기준 상위 5명)
            </span>
          </div>
          <div className={styles.friends}>
            {friends.map((friend, index) => (
              <div key={index} className={styles.friendInfo}>
                <img
                  className={styles.friendProfileImg}
                  src={friend.image}
                  alt="friend profile"
                />
                <div className={styles.friendData}>
                  <span>{friend.name}/</span>
                  <span>{friend.count}회</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
