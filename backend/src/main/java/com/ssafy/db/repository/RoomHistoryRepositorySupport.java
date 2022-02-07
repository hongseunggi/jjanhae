package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RoomHistoryRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QRoomHistory qRoomHistory = QRoomHistory.roomHistory;

    public Optional<RoomHistory> findRoomHistoryByUserSeqAndRoomSeq(User userSeq, Room roomSeq) {
        RoomHistory roomHistory = jpaQueryFactory.select(qRoomHistory).from(qRoomHistory)
                .where(qRoomHistory.roomSeq.eq(roomSeq).and(qRoomHistory.userSeq.eq(userSeq))).fetchOne();
        if(roomHistory == null) return Optional.empty();
        return Optional.ofNullable(roomHistory);
    }

    public List<RoomHistory> findRoomHistoriesByRoomSeq(Room roomSeq){
        List<RoomHistory> roomHistories = jpaQueryFactory.select(qRoomHistory).from(qRoomHistory)
                .where(qRoomHistory.roomSeq.eq(roomSeq).and(qRoomHistory.action.eq("join"))).fetch();
        return roomHistories;
    }

}