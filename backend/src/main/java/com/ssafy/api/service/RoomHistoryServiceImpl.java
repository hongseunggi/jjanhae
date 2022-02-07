package com.ssafy.api.service;

import com.ssafy.api.request.AddHistoryRequest;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.RoomHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 *	방 이력 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("roomHistoryService")
public class RoomHistoryServiceImpl implements RoomHistoryService{
    @Autowired
    RoomHistoryRepository roomHistoryRepository;


    @Override
    public RoomHistory addHistory(User user, Room room, AddHistoryRequest addHistoryRequest) {
        RoomHistory roomHistory= new RoomHistory();
        roomHistory.setRoomSeq(room);
        roomHistory.setAction(addHistoryRequest.getAction());
        roomHistory.setInsertedTime(addHistoryRequest.getInsertedTime());
        roomHistory.setUserSeq(user);

        return roomHistoryRepository.save(roomHistory);
    }

    @Override
    public RoomHistory findOneHistoryAll(Long userSeq) {
        return roomHistoryRepository.findOneHistoryDesc(userSeq);
    }

    @Override
    public List<RoomHistory> findAllRoomListByUserSeq(Long userSeq) {
        return roomHistoryRepository.findAllRoomListByUserSeq(userSeq);
    }

    @Override
    public List<Integer> findAllRoomSeqByUserSeqAndDate(Long userSeq,String date) {
        return roomHistoryRepository.findAllRoomSeqByUserSeqAndDate(userSeq,date);
    }


    public RoomHistory findRoomByUserSeq(Long userSeq) {
        return roomHistoryRepository.findRoomByUserSeq(userSeq);
    }

    @Override
    public List<Integer> findAllUserSeqByRoomSeq(Long userSeq) {
        return roomHistoryRepository.findAllUserSeqByRoomSeq(userSeq);
    }

    public RoomHistory findOneHistoryInRoom(Long userSeq, Long roomSeq) {
        return roomHistoryRepository.findOneHistoryInRoom(userSeq, roomSeq);
    }

    @Override
    public int countJoinUser(Long roomSeq) {
        return roomHistoryRepository.countJoinUser(roomSeq);
    }

    @Override
    public void updateRoomAction(RoomHistory roomHistory) {
        roomHistoryRepository.save(roomHistory);
    }

}
