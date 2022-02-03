import React, { useEffect, useState } from "react";
import UserApi from "../../api/UserApi.js";
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

const Profile = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [drink, setDrink] = useState("");
  const [drinkLimit, setDrinkLimit] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const {getUserProfile} = UserApi;
  // 친구들을 특정하기 위한 값이 필요 ex) id
  const [friends, setFriends] = useState([
    { name: "김정연", count: 5, image: image1 },
    { name: "유소연", count: 4, image: image2 },
    { name: "배하은", count: 3, image: image3 },
    { name: "홍승기", count: 2, image: image4 },
    { name: "송민수", count: 1, image: image5 },
  ]);
  const handleEditMode = (e) => {
    e.preventDefault();
    console.log(name);
    setIsEdit((prev) => !prev);
  };

  useEffect( async ()=>{
    const {data} = await getUserProfile();
    console.log(data);
    setName(data.name);
    setEmail(data.email);
    let year = data.birthday.year;
    let month = data.birthday.month;
    let day = data.birthday.day;
    if(data.birthday.month < 9) month = "0"+data.birthday.month;
    if(data.birthday.day < 9) day = "0"+data.birthday.day;
    let birth = year + "-" + month + "-" + day;
    setBirthday(birth);
    setId(data.userId);
    setDrink(data.drink);
    setDrinkLimit(data.drinkLimit);
  }, [])

  return (
    <div className={styles.profileForm}>
      <header className={styles.title}>
        <h1>{name}님의 프로필</h1>
      </header>
      <main className={styles.profile}>
        <section className={styles.userProfile}>
          <form className={styles.userInfoForm}>
            <div className={styles.profileRow}>
              <img className={styles.profileImg} src={image6} alt="profile" />
              <div
                className={
                  isEdit
                    ? `${styles.userInfoData} ${styles.userInfoDataEdit}`
                    : styles.userInfoData
                }
              >
                <label htmlFor="name">이름</label>
                <input id="name" type="text" value={name} disabled={!isEdit} />
              </div>
              <Link to="/user/calendar">
                <CalendarIcon width="40" height="40" />
              </Link>
            </div>
            <div className={styles.inputRow}>
              <div
                className={
                  isEdit
                    ? `${styles.userInfoData} ${styles.userInfoDataEdit} `
                    : styles.userInfoData
                }
              >
                <label htmlFor="id">아이디</label>
                <input id="id" type="text" value={id} disabled={!isEdit} />
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
                <label htmlFor="email">이메일</label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  disabled={!isEdit}
                />
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
                <input
                  id="birthday"
                  type="text"
                  value={birthday}
                  disabled={!isEdit}
                />
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
                  <input
                    id="drink"
                    type="text"
                    value={drink}
                    disabled={!isEdit}
                  />
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
                  <input
                    id="drinkLimit"
                    type="text"
                    value={drinkLimit}
                    disabled={!isEdit}
                  />
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
