package com.ssafy.api.service;

import com.ssafy.api.request.CreateRoomRequest;
import com.ssafy.api.request.SortRoomListRequest;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 *	방 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface RoomService {
    Room createRoom(User user, LocalDate now, CreateRoomRequest createRoomRequest);
    List<Room> getRoomList(Long uerSeq);


    Room createRoom(User user, LocalDateTime now, CreateRoomRequest createRoomRequest);
    Room findRoomByRoomSeq(Long roomSeq);
    void exitRoom(Long roomSeq);
    Room findRoomByOwner(Long roomSeq);
    List<Room> selectRoomList(SortRoomListRequest sortRoomListRequest);
    List<Room> selectRoomByTitle(String title);
    List<Room> findRoomListByRoomSeq(List roomSeqList);

}
