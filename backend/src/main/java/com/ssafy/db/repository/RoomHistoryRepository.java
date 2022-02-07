package com.ssafy.db.repository;

import com.ssafy.db.entity.RoomHistory;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * 방 이력 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
public interface RoomHistoryRepository extends JpaRepository<RoomHistory, Long> {
    @Query(value = "select * from room_history where user_seq = :userSeq" +
            " order by history_seq desc" +
            " limit 1", nativeQuery = true)
    public RoomHistory selectLastYn(@Param(value = "userSeq") Long userSeq);

    @Query(value = "select * from room_history" +
            " where user_seq = :userSeq and last_yn = 'Y'" +
            " order by history_seq desc limit 1", nativeQuery = true)
    public RoomHistory findRoomByUserSeq(@Param(value = "userSeq") Long userSeq);

    public RoomHistory findRoomHistoryByUserSeqAndRoomSeq(User userSeq, Room roomSeq);

    public List<RoomHistory> findRoomHistoriesByRoomSeq(Room roomSeq);
}
