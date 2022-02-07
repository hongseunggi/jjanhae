package com.ssafy.db.repository;

import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 방 이력 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
public interface RoomHistoryRepository extends JpaRepository<RoomHistory, Long> {
    @Query(value = "select * from room_history where user_seq = :userSeq" +
            " order by history_seq desc" +
            " limit 1", nativeQuery = true)
    public RoomHistory selectLastYn(@Param(value = "userSeq") Long userSeq);

    @Query(value = "select * from room_history where user_seq = :userSeq" +
            " order by history_seq desc" , nativeQuery = true)
    public List<RoomHistory> findAllRoomListByUserSeq(@Param(value = "userSeq")Long userSeq);

    @Query(value = "select * from room_history" +
            " where user_seq = :userSeq and last_yn = 'Y'" +
            " order by history_seq desc limit 1", nativeQuery = true)
    public RoomHistory findRoomByUserSeq(@Param(value = "userSeq") Long userSeq);

    @Query(value = "select distinct room_seq from room_history where user_seq = :userSeq " +
            "and date_format(inserted_time, '%d') = :date" , nativeQuery = true)
    public List<Integer> findAllRoomSeqByUserSeqAndDate(@Param(value = "userSeq")Long userSeq,@Param(value = "date")String date);

    @Query(value = "select distinct user_seq from room_history where room_seq = :roomSeq", nativeQuery = true)
    public List<Integer> findAllUserSeqByRoomSeq(@Param(value = "roomSeq")Long roomSeq);



}
