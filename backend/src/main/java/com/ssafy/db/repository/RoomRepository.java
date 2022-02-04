package com.ssafy.db.repository;

import com.ssafy.db.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * 방 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query(value = "select * from room" +
            " where owner = :userSeq" +
            " and del_yn = 'N'", nativeQuery = true)
    public Room selectRoomByOwner(@Param(value = "userSeq") Long userSeq);
}
