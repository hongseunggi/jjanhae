package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.ssafy.api.request.UserInfoPostReq;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
<<<<<<< HEAD
import java.time.LocalDate;
=======
>>>>>>> eb0f126b61249c48f6df6812661bd66ff7070095
import java.time.LocalDateTime;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
<<<<<<< HEAD
    Long userSeq;
=======
    Long userSeq = null;
>>>>>>> eb0f126b61249c48f6df6812661bd66ff7070095

    String userId;
    String name;
    String email;
<<<<<<< HEAD
    LocalDate birthday;
=======
    LocalDateTime birthday;
>>>>>>> eb0f126b61249c48f6df6812661bd66ff7070095
    String delYn;
    String imageUrl;
    String drink;
    int drinkLimit;
    String authYn;
    String authCode;
<<<<<<< HEAD
    String provider;
=======
>>>>>>> eb0f126b61249c48f6df6812661bd66ff7070095

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    String password;


}
