package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.QRoom;
import com.ssafy.db.entity.QRoomHistory;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

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

    public Optional<Room> findRoomByRoomSeq(Long roomSeq) {
        Room room = jpaQueryFactory.select(qRoom).from(qRoom)
                .where(qRoom.roomSeq.eq(roomSeq)).fetchOne();
        if(room == null) return Optional.empty();
        return Optional.ofNullable(room);
    }

}
