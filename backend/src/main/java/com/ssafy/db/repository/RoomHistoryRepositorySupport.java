package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class RoomHistoryRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QRoomHistory qRoomHistory = QRoomHistory.roomHistory;

    public Optional<RoomHistory> findRoomHistoryByUserAndRoom(User user, Room room) {
        RoomHistory roomHistory = jpaQueryFactory.select(qRoomHistory).from(qRoomHistory)
                .where(qRoomHistory.roomSeq.eq(room).and(qRoomHistory.userSeq.eq(user))).fetchOne();
        if(roomHistory == null) return Optional.empty();
        return Optional.ofNullable(roomHistory);
    }

}