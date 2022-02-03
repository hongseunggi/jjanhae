package com.ssafy.api.service;

import com.ssafy.api.request.AddHistoryRequest;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import com.ssafy.db.repository.RoomHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *	방 이력 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("roomHistoryService")
public class RoomHistoryServiceImpl implements RoomHistoryService{
    @Autowired
    RoomHistoryRepository roomHistoryRepository;


    @Override
    public RoomHistory addHistory(Room room, AddHistoryRequest addHistoryRequest) {
        RoomHistory roomHistory= new RoomHistory();
        roomHistory.setRoomSeq(room);



        return roomHistoryRepository.save(roomHistory);
    }
}
