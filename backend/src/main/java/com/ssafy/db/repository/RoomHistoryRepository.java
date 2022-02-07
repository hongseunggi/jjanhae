package com.ssafy.db.repository;

import com.ssafy.db.entity.Room;
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
    @Query(value = "select * from room_history where user_seq = :userSeq order by history_seq desc limit 1", nativeQuery = true)
    public RoomHistory findOneHistoryDesc(@Param(value = "userSeq") Long userSeq);


    @Query(value = "select * from room_history" +
            " where user_seq = :userSeq and last_yn = 'Y'" +
            " order by history_seq desc limit 1", nativeQuery = true)
    public RoomHistory findRoomByUserSeq(@Param(value = "userSeq") Long userSeq);

    public RoomHistory findRoomHistoryByUserSeqAndRoomSeq(User userSeq, Room roomSeq);

    public List<RoomHistory> findRoomHistoriesByRoomSeq(Room roomSeq);

    @Query(value = "select * from room_history where room_seq = :roomSeq and user_seq = :userSeq", nativeQuery = true)
    public RoomHistory findOneHistoryInRoom(@Param(value = "userSeq") Long userSeq, @Param(value = "roomSeq") Long roomSeq);

    @Query(value = "select count(*) from room_history where room_seq = :roomSeq and action = 'JOIN'", nativeQuery = true)
    public int countJoinUser(@Param(value = "roomSeq") Long roomSeq);

}
