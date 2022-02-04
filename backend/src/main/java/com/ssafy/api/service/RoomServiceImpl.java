package com.ssafy.api.service;

import com.ssafy.api.request.CreateRoomRequest;
import com.ssafy.api.request.SortRoomListRequest;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.RoomRepository;
import com.ssafy.db.repository.RoomRepositorySupport;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

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
    public Room createRoom(User user, LocalDateTime now, CreateRoomRequest createRoomRequest) {
        Room room = new Room();
        room.setOwner(user);
        room.setTitle(createRoomRequest.getName());
        room.setThumbnailUrl(createRoomRequest.getThumbnail());
        room.setType(createRoomRequest.getType());
        room.setPassword(createRoomRequest.getPassword());
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

    @Override
    public Room findRoomByRoomSeq(Long roomSeq) {
        Optional<Room> res = roomRepositorySupport.findRoomByRoomSeq(roomSeq);
        Room room = null;
        if(res.isPresent()) {
            room = res.get();
        }
        return room;
    }

    @Override
    public void exitRoom(Long roomSeq) {
        Optional<Room> res = roomRepositorySupport.findRoomByRoomSeq(roomSeq);
        Room room = null;
        if(res.isPresent()) {
            room = res.get();
            room.setDelYn("Y");
            room.setEndTime(LocalDateTime.now());
            roomRepository.save(room);
        }
    }

    @Override
    public Room findRoomByOwner(Long roomSeq) {
        return roomRepository.selectRoomByOwner(roomSeq);
    }

    @Override
    public List<Room> selectRoomList(SortRoomListRequest sortRoomListRequest) {
        SortRoomListRequest.Paging paging = sortRoomListRequest.getPaging();
        System.out.println("paging: " + paging.getHasNext()+", "+paging.getLimit()+", "+paging.getOffset());
        List<Room> res = roomRepository.selectRoomList(paging.getLimit(), paging.getOffset());
        // sort 기준으로 order(asc, desc)
        // 생성시간 기준 순
        System.out.println(sortRoomListRequest.getSort());
        if(sortRoomListRequest.getSort().equals(null)) return res;

        if("createdAt".equals(sortRoomListRequest.getSort())) {
            Collections.sort(res, new Comparator<Room>() {
                @Override
                public int compare(Room o1, Room o2) {
                    if("asc".equals(sortRoomListRequest.getOrder())) {
                        return o1.getStartTime().compareTo(o2.getStartTime());
                    } else {
                        return o2.getStartTime().compareTo(o1.getStartTime());
                    }
                }
            });
        } else if("drinkLimit".equals(sortRoomListRequest.getSort())) {
            Collections.sort(res, new Comparator<Room>() {
                @Override
                public int compare(Room o1, Room o2) {
                    if("asc".equals(sortRoomListRequest.getOrder())) {
                        return o1.getDrinkLimit() - o2.getDrinkLimit();
                    } else {
                        return o2.getDrinkLimit() - o1.getDrinkLimit();
                    }
                }
            });
        }
        // all은 정렬하지 않음
        return res;
    }

    @Override
    public int countJoinUser(Long roomSeq) {
        return roomRepository.countJoinUser(roomSeq);
    }
}
