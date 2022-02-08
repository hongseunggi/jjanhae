package com.ssafy.db.repository;

import com.ssafy.api.response.DrinkTogether;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import com.ssafy.db.entity.User;
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

    @Query(value = "select room_seq from room_history where user_seq = :userSeq" +
            " order by history_seq desc" , nativeQuery = true)
    public List<Integer> findAllRoomSeqByUserSeq(@Param(value = "userSeq")Long userSeq);
    @Query(value = "select * from room_history where room_seq = :roomSeq and user_seq = :userSeq", nativeQuery = true)
    public RoomHistory findOneHistoryInRoom(@Param(value = "userSeq") Long userSeq, @Param(value = "roomSeq") Long roomSeq);

    @Query(value = "select count(*) from room_history where room_seq = :roomSeq and action = 'JOIN'", nativeQuery = true)
    public int countJoinUser(@Param(value = "roomSeq") Long roomSeq);

    @Query(value = "select * from room_history" +
            " where user_seq = :userSeq and last_yn = 'Y'" +
            " order by history_seq desc limit 1", nativeQuery = true)
    public RoomHistory findRoomByUserSeq(@Param(value = "userSeq") Long userSeq);

    public RoomHistory findRoomHistoryByUserSeqAndRoomSeq(User userSeq, Room roomSeq);


    @Query(value = "select distinct user_seq from room_history where room_seq = :roomSeq", nativeQuery = true)
    public List<Integer> findAllUserSeqByRoomSeq(@Param(value = "roomSeq")Long roomSeq);

    public List<RoomHistory> findRoomHistoriesByRoomSeq(Room roomSeq);

    @Query(value = "select distinct room_seq from room_history where user_seq = :userSeq " +
            "and date_format(inserted_time, '%d') = :date" , nativeQuery = true)
    public List<Integer> findAllRoomSeqByUserSeqAndDate(@Param(value = "userSeq")Long userSeq,@Param(value = "date")String date);

    @Query(value = "select user_seq as userSeq, count(user_seq) as numberOf from room_history" +
            " where room_seq in (select room_seq from room_history where user_seq = :userSeq)" +
            " and user_seq != :userSeq" +
            " group by user_seq" +
            " order by numberOf desc" +
            " limit 5", nativeQuery = true)
    public List<DrinkTogether> findDrinkTogether(@Param(value = "userSeq") Long userSeq);
}
