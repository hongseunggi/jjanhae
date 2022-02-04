package com.ssafy.api.controller;

import com.ssafy.api.request.AddHistoryRequest;
import com.ssafy.api.request.CreateRoomRequest;
import com.ssafy.api.request.ExitRoomRequest;
import com.ssafy.api.response.CreateRoomResponse;
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
        Long roomSeq = room.getRoomSeq();
        AddHistoryRequest addHistoryRequest = new AddHistoryRequest();
        addHistoryRequest.setRoomSeq(roomSeq);
        addHistoryRequest.setUserSeq(user.getUserSeq());
        addHistoryRequest.setAction(0);
        addHistoryRequest.setLastYn("Y");
        addHistoryRequest.setInsertedTime(LocalDateTime.now());
        System.out.println("얻어낸 roomSeq로 Room_history 테이블에도 추가");
        RoomHistory roomHistory = roomHistoryService.addHistory(user, room, addHistoryRequest);
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

}
