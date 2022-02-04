package com.ssafy.api.service;

import com.ssafy.api.request.CreateRoomRequest;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.RoomRepository;
import com.ssafy.db.repository.RoomRepositorySupport;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

/**
 *	방 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("roomServiceImpl")
public class RoomServiceImpl implements RoomService {
    @Autowired
    RoomRepository roomRepository;

    @Autowired
    RoomRepositorySupport roomRepositorySupport;

    @Override
    public Room createRoom(User user, LocalDate now, CreateRoomRequest createRoomRequest) {
        Room room = new Room();
        room.setOwner(user);
        room.setTitle(createRoomRequest.getName());
        room.setThumbnailUrl(createRoomRequest.getThumbnail());
        room.setType(createRoomRequest.getType());
        room.setDescription(createRoomRequest.getDescription());
        room.setDrinkLimit(createRoomRequest.getDrinkLimit());
        room.setDelYn("N");
        room.setPlayYn("N");
        room.setStartTime(now);
//        room.setStartTime(createRoomRequest.get);
        // ismute, isOn 추후에 추가할지 말지 결정하기
        // TO DO...
        return roomRepository.save(room);
    }
}
