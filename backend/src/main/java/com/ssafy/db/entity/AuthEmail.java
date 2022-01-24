package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * 이메일 모델 정의.
 */
@Entity
@Getter
@Setter
public class AuthEmail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long authSeq;

    String email;
    String authCode;
    String timeLimit;
}