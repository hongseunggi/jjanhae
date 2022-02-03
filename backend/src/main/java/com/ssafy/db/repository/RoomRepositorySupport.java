package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.QRoom;
import com.ssafy.db.entity.QRoomHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * 방 모델 관련 디비 쿼리 생성을 위한 구현 정의.
 */
@Repository
public class RoomRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QRoom qRoom = QRoom.room;
    QRoomHistory qRoomHistory = QRoomHistory.roomHistory;
}
