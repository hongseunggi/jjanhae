package com.ssafy.db.repository;

import com.ssafy.db.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
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

    // 생성시간 오름차순
    @Query(value = "select * from room where del_yn='N'" +
            " order by start_time" +
            " limit :limit offset :offset", nativeQuery = true)
    public List<Room> selectRoomListOrderByStartTime(@Param(value = "limit") int limit, @Param(value = "offset") int offset);

    // 생성시간 내림차순
    @Query(value = "select * from room where del_yn='N'" +
            " order by start_time desc" +
            " limit :limit offset :offset", nativeQuery = true)
    public List<Room> selectRoomListOrderByStartTimeDesc(@Param(value = "limit") int limit, @Param(value = "offset") int offset);

    // 주량 오름차순
    @Query(value = "select * from room where del_yn='N'" +
            " order by drink_limit" +
            " limit :limit offset :offset", nativeQuery = true)
    public List<Room> selectRoomListOrderByDrinkLimit(@Param(value = "limit") int limit, @Param(value = "offset") int offset);

    // 주량 내림차순
    @Query(value = "select * from room where del_yn='N'" +
            " order by drink_limit desc" +
            " limit :limit offset :offset", nativeQuery = true)
    public List<Room> selectRoomListOrderByDrinkLimitDesc(@Param(value = "limit") int limit, @Param(value = "offset") int offset);

    @Query(value = "select * from room where title like %:title% and del_yn='N'" +
            " order by start_time desc", nativeQuery = true)
    public List<Room> selectRoomByTitle(@Param(value = "title") String title);

    @Query(value = "select * from room" +
            " where room_seq in :roomSeqList and end_time is not null" , nativeQuery = true)
    public List<Room> findEndRoomListByRoomSeq(@Param(value = "roomSeqList") List roomSeqList);

    @Query(value = "select * from room" +
            " where room_seq in :roomSeqList and end_time is not null" , nativeQuery = true)
    public List<Room> findAllEndRoomSeqByRoomSeq(@Param(value = "roomSeqList") List roomSeqList);

}

