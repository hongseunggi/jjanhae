package com.ssafy.db.repository;

import com.ssafy.db.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 방 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query(value = "select * from room" +
            " where owner = :userSeq" +
            " and del_yn = 'N'", nativeQuery = true)
    public Room selectRoomByOwner(@Param(value = "userSeq") Long userSeq);

    @Query(value = "select * from room where del_yn='N' limit :limit offset :offset", nativeQuery = true)
    public List<Room> selectRoomList(@Param(value = "limit") int limit, @Param(value = "offset") int offset);

    @Query(value = "select count(case when action=1 then 1 end)-count(case when action=2 then 1 end) as joinUserNum" +
            " from room_history" +
            " where room_seq = :roomSeq" +
            " group by room_seq", nativeQuery = true)
    public int countJoinUser(@Param(value = "roomSeq") Long roomSeq);
}
