package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.QRoomHistory;
import com.ssafy.db.entity.RoomHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RoomHistoryRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QRoomHistory qRoomHistory = QRoomHistory.roomHistory;

}
