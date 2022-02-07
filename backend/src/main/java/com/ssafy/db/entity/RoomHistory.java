package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Room History 모델 정의.
 */
@Entity
@Getter
@Setter
public class RoomHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long historySeq;

    @ManyToOne
    @JoinColumn(name = "user_seq")
    User userSeq;

    @ManyToOne
    @JoinColumn(name = "room_seq")
    Room roomSeq;

    String action; // CREATE/JOIN/EXIT

    LocalDateTime insertedTime; // 로그가 쌓인 시각

//    String lastYn; // 현재 방에 접속중인지 Y or N

    LocalDateTime updatedTime; // 업데이트 시각


}
