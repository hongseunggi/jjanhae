package com.ssafy.api.controller;

import com.ssafy.api.request.AddHistoryRequest;
import com.ssafy.api.request.CreateRoomRequest;
import com.ssafy.api.request.ExitRoomRequest;
import com.ssafy.api.request.SortRoomListRequest;
import com.ssafy.api.response.*;
import com.ssafy.api.service.RoomHistoryService;
import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.UserService;
import com.ssafy.api.response.CreateRoomResponse;
import com.ssafy.api.service.RoomHistoryService;
import com.ssafy.api.service.RoomService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 방 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "방 API")
@RestController
@RequestMapping("/api/v1/conferences")
public class RoomController {

    @Autowired
    UserService userService;

    @Autowired
    RoomService roomService;

    @Autowired
    RoomHistoryService roomHistoryService;

    @PostMapping(value = "")
    @ApiOperation(value = "방 생성", notes = "방을 생성한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 202, message = "방 중복 입장 불가"),
            @ApiResponse(code = 204, message = "사용자 없음"),
            @ApiResponse(code = 403, message = "권한 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> createRoom(@ApiIgnore Authentication authentication, @RequestBody CreateRoomRequest createRoomRequest) {
        /**
         * 유저 권한으로 방을 생성한다.
         * 권한 : 해당 유저
         * */
        if(authentication == null){
            System.out.println("얘 토큰 없다!!");
            return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
        }
        // 토큰이 있는 유저일 때만 userId 얻어내기
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        System.out.println("로그인한 유저 : "+ userDetails.getUser());
        User user = userDetails.getUser();
        // 얻어낸 user객체로 userSeq 얻어내기
        System.out.println("user seq : " + user.getUserSeq());
        System.out.println("userId : "+user.getUserId());

        // 해당 유저가 방에 접속해있는지
        RoomHistory selectLastYn = roomHistoryService.selectLastYn(user.getUserSeq());
        if(selectLastYn != null && "Y".equals(selectLastYn.getLastYn())) {
            // 현재 접속상태이므로 중복입장 불가
            return ResponseEntity.status(200).body(BaseResponseBody.of(202, "방 중복 입장 불가"));
        }

        // Room 테이블에 userSeq 포함하여 저장.
        System.out.println("Room 테이블에 userSeq 포함하여 저장");
        createRoomRequest.setOwner(user.getUserSeq());
        Room room = roomService.createRoom(user, LocalDateTime.now(), createRoomRequest);

        // 얻어낸 roomSeq로 Room_history 테이블에도 추가
        // CREATE
        Long roomSeq = room.getRoomSeq();
        AddHistoryRequest addHistoryRequest = new AddHistoryRequest();
        addHistoryRequest.setRoomSeq(roomSeq);
        addHistoryRequest.setUserSeq(user.getUserSeq());
        addHistoryRequest.setAction(0);
        addHistoryRequest.setLastYn("Y");
        addHistoryRequest.setInsertedTime(LocalDateTime.now());
        System.out.println("얻어낸 roomSeq로 Room_history 테이블에도 추가");
        roomHistoryService.addHistory(user, room, addHistoryRequest);

        // JOIN도 함께 쌓아줌
        addHistoryRequest.setAction(1);
        roomHistoryService.addHistory(user, room, addHistoryRequest);
        System.out.println("roomHistory 저장 성공");
        return ResponseEntity.status(200).body(CreateRoomResponse.of("Success", room.getRoomSeq()));
    }


    @PostMapping(value = "/exit")
    @ApiOperation(value = "방 퇴장", notes = "방에서 나간다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> exitRoom(@RequestBody ExitRoomRequest exitRoomRequest) {
        /**
         * 해당 방에서 나간다.
         * 권한 : 해당 유저
         * */
        System.out.println("ExitRoom Start ...");
        // userId로 userSeq 얻어오기
        User user = userService.getUserByUserId(exitRoomRequest.getUserId());
        System.out.println("userSeq : " + user.getUserSeq());

        // target room 정보 얻어오기
//        Room room = roomService.findRoomByRoomSeq(user.getUserSeq());
        Room room = roomService.findRoomByOwner(user.getUserSeq());

        // 나가려는 유저가 방장이면 방 exit update처리
        // 방을 나갔다는건 무조건 그 방 정보가 있단 뜻이므로 null체크 별도로 해주지 않음
        if(room.getOwner().getUserSeq() == user.getUserSeq()) {
            // 방장이 방을 나갔으므로 endtime을 현재시간으로 넣고, delYn="Y"로 업데이트
            roomService.exitRoom(room.getRoomSeq());
        }

        // history table에 퇴실로그 한줄 쌓기
        // action:2(퇴실), lastYn:N
        AddHistoryRequest addHistoryRequest = new AddHistoryRequest();
        addHistoryRequest.setRoomSeq(exitRoomRequest.getConferenceId());
        addHistoryRequest.setUserSeq(user.getUserSeq());
        addHistoryRequest.setAction(2);
        addHistoryRequest.setLastYn("N");
        addHistoryRequest.setInsertedTime(LocalDateTime.now());
        roomHistoryService.addHistory(user, room, addHistoryRequest);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }


    @PostMapping(value = "/order")
    @ApiOperation(value = "대기실, 정렬", notes = "조건에 맞게 정렬된 대기실 목록을 리턴한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> sortRoomList(@RequestBody SortRoomListRequest sortRoomListRequest) {
        /**
         * 해당 방에서 나간다.
         * 권한 : 해당 유저
         * */
        System.out.println("sortRoomList Start ...");

        // 현재 활성화중인 방 번호 리스트를 얻어온다.
        List<Room> rooms = roomService.selectRoomList(sortRoomListRequest);

        List<SortRoomResponse> roomInfoList = new ArrayList<>();
        for(int i = 0; i < rooms.size(); i++) {
            SortRoomResponse sortRoomResponse = new SortRoomResponse();
            System.out.println("roomSeq : "+rooms.get(i).getRoomSeq());
            // 각 방마다 인원수를 구해온다.
            int numberOfJoin = roomService.countJoinUser(rooms.get(i).getRoomSeq());
            System.out.println("참여인원 수 : "+numberOfJoin);
            // List<SortRoomResponse> 에 담아준다.
            sortRoomResponse.setConferenceId(rooms.get(i).getRoomSeq());
            sortRoomResponse.setType(rooms.get(i).getType());
            sortRoomResponse.setPassword(rooms.get(i).getPassword());
            sortRoomResponse.setJoinUserNum(numberOfJoin);
            sortRoomResponse.setOwnerId(rooms.get(i).getOwner().getUserId()); // 방장 userId
            sortRoomResponse.setStartTime(rooms.get(i).getStartTime()); // 시작시간
            sortRoomResponse.setThumbnail(rooms.get(i).getThumbnailUrl()); // 썸네일 이미지
            sortRoomResponse.setTitle(rooms.get(i).getTitle());
            sortRoomResponse.setDescription(rooms.get(i).getDescription());
            sortRoomResponse.setDrinkLimit(rooms.get(i).getDrinkLimit());
            roomInfoList.add(sortRoomResponse);
        }

        return ResponseEntity.status(200).body(SortRoomListResponse.of(roomInfoList));
    }


    @GetMapping(value = "/search", params = {"keyword"})
    @ApiOperation(value = "방 검색", notes = "키워드가 포함된 제목의 방들을 검색한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> findRoomByKeyword(@RequestParam String keyword) throws Exception {
        System.out.println("findRoomByKeyword");
        System.out.println("keyword "+keyword);
        List<Room> rooms = roomService.selectRoomByTitle(keyword);
        List<SearchRoomResponse> searchRoomList = new ArrayList<>();
        for(int i = 0; i < rooms.size(); i++) {
            // 각 방마다 인원수를 구해온다.
            int numberOfJoin = roomService.countJoinUser(rooms.get(i).getRoomSeq());
            System.out.println("참여인원 수 : "+numberOfJoin);
            // List<SearchRoomResponse> 에 담아준다.
            SearchRoomResponse searchRoomResponse = new SearchRoomResponse();
            searchRoomResponse.setConferenceId(rooms.get(i).getRoomSeq());
            searchRoomResponse.setType(rooms.get(i).getType());
            searchRoomResponse.setPassword(rooms.get(i).getPassword());
            searchRoomResponse.setJoinUserNum(numberOfJoin);
            searchRoomResponse.setOwnerId(rooms.get(i).getOwner().getUserId());
            searchRoomResponse.setStartTime(rooms.get(i).getStartTime());
            searchRoomResponse.setThumbnail(rooms.get(i).getThumbnailUrl());
            searchRoomResponse.setTitle(rooms.get(i).getTitle());
            searchRoomResponse.setDescription(rooms.get(i).getDescription());
            searchRoomResponse.setDrinkLimit(rooms.get(i).getDrinkLimit());
            searchRoomList.add(searchRoomResponse);
        }

        return ResponseEntity.status(200).body(SearchRoomListResponse.of(searchRoomList));
    }

}
