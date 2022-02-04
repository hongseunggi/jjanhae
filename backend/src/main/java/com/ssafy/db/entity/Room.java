package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Room 모델 정의.
 */
@Entity
@Getter
@Setter
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long roomSeq;

    @ManyToOne
    @JoinColumn(name = "owner")
    User owner;

    int type; // 공개 or 비공개
    String password;
    String title;
    String description;
    String thumbnailUrl;
    int drinkLimit;
    String delYn; // 종료여부
    LocalDateTime startTime;
    LocalDateTime endTime;
    String imageUrl;
    String playYn; // 게임진행 여부
}
