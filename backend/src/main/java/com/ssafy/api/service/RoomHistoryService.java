package com.ssafy.api.service;

import com.ssafy.api.request.AddHistoryRequest;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import com.ssafy.db.entity.User;

/**
 *	방 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface RoomHistoryService {
    RoomHistory addHistory(User user, Room room, AddHistoryRequest addHistoryRequest);
    RoomHistory exitHistory(RoomHistory roomHistory);
    RoomHistory selectLastYn(Long userSeq);
    RoomHistory findRoomByUserSeq(Long userSeq);
    RoomHistory findRoomHistoryByUserAndRoom(User user, Room room);
}
