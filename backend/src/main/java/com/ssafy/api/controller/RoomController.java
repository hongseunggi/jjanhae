package com.ssafy.api.controller;

import com.ssafy.api.request.*;
import com.ssafy.api.response.*;
import com.ssafy.api.service.RoomHistoryService;
import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.UserService;
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
import springfox.documentation.annotations.ApiIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 방 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "방 API")
@RestController
@RequestMapping("/api/v1/rooms")
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
        User user = userDetails.getUser();
        // 얻어낸 user객체로 userSeq 얻어내기
        System.out.println("user seq : " + user.getUserSeq());
        System.out.println("userId : "+user.getUserId());

        // 해당 유저가 방에 접속해있는지
        Long userSeq = user.getUserSeq();
        System.out.println("login userSeq : " + userSeq+", userId : "+user.getUserId());
        RoomHistory roomHistory = roomHistoryService.findOneHistoryAll(userSeq);
        if(roomHistory != null && "JOIN".equals(roomHistory.getAction().toUpperCase())) {
            return ResponseEntity.status(200).body(BaseResponseBody.of(204, "현재 참여중인 방이 있습니다."));
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
        addHistoryRequest.setAction("JOIN");
        addHistoryRequest.setInsertedTime(LocalDateTime.now());
        roomHistoryService.addHistory(user, room, addHistoryRequest);
        return ResponseEntity.status(200).body(CreateRoomResponse.of("Success", room.getRoomSeq()));
    }


    @PatchMapping(value = "/exit")
    @ApiOperation(value = "방 퇴장", notes = "방에서 나간다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> exitRoom(@ApiIgnore Authentication authentication, @RequestBody ExitRoomRequest exitRoomRequest) {
        /**
         * 해당 방에서 나간다.
         * 권한 : 해당 유저
         * */
        System.out.println("ExitRoom Start ...");
        // userId로 userSeq 얻어오기
        if(authentication == null){
            System.out.println("얘 토큰 없다!!");
            return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
        }
        // 토큰이 있는 유저일 때만 userId 얻어내기
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        System.out.println("방을 나가려는 유저 : "+ userDetails.getUser().getUserId());
        User user = userDetails.getUser();

        // target room 정보 얻어오기
        // 이력 뒤져서 현재 userSeq가 들어있는 방을 찾아와야 한다.
        // RoomHistory roomHistory = roomHistoryService.findRoomByUserSeq(user.getUserSeq());
        // exitRequest에 받아온 roomSeq로 찾아야 하지 않나..?
        Room room = roomService.findRoomByRoomSeq(exitRoomRequest.getRoomSeq());
        RoomHistory roomHistory = roomHistoryService.findRoomHistoryByUserAndRoom(user, room);
        System.out.println("현재 들어있는 방: "+room.getRoomSeq() + ", 방장: "+room.getOwner().getUserSeq());

        // 나가려는 유저가 방장이면 방 exit update처리
        // 방을 나갔다는건 무조건 그 방 정보가 있단 뜻이므로 null체크 별도로 해주지 않음
        if(room.getOwner().getUserSeq() == user.getUserSeq()) {
            // 방장이 방나가면 방폭파가 되므로 방에 있는 모든 유저를 나가도록 하는 로직 필요
            // TO DO ...
            // room기준으로 action이 join인 user들을 찾아서 roomHistory 여러개를 가져옴
            List<RoomHistory> roomHistories = roomHistoryService.findRoomHistoriesByRoom(room);
            System.out.println("나갈 기록들" + roomHistories);
            for (int i = 0; i < roomHistories.size(); i++) {
                roomHistoryService.exitHistory(roomHistories.get(i));
            }

            // 그 History들의 action을 모두 exit로 바꿈
            System.out.println("방장이므로 방 나갈 시 방도 같이 닫힌다.");
            // 방장이 방을 나갔으므로 endtime을 현재시간으로 넣고, delYn="Y"로 업데이트
            roomService.exitRoom(roomHistory.getRoomSeq().getRoomSeq());
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "방 닫힘"));
        }

        // history table 해당 유저의 action을 퇴실로 변경하기
        // action:exit(퇴실)
        roomHistoryService.exitHistory(roomHistory);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }


    @GetMapping(value = "/order", params = {"sort", "order", "limit", "offset"})
    @ApiOperation(value = "대기실, 정렬", notes = "조건에 맞게 정렬된 대기실 목록을 리턴한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> sortRoomList(@RequestParam String sort, String order, int limit, int offset) {
        /**
         * 조건에 따라 정렬된 방 리스트를 리턴한다.
         * 권한 : 해당 유저
         * */
        System.out.println("sortRoomList Start ...");

        // 현재 활성화중인 방 번호 리스트를 얻어온다.
        SortRoomListRequest sortRoomListRequest = new SortRoomListRequest();
        sortRoomListRequest.setSort(sort);
        sortRoomListRequest.setOrder(order);
        sortRoomListRequest.setLimit(limit);
        sortRoomListRequest.setOffset(offset);
        List<Room> rooms = roomService.selectRoomList(sortRoomListRequest);

        List<SortRoomResponse> roomInfoList = new ArrayList<>();
        for(int i = 0; i < rooms.size(); i++) {
            SortRoomResponse sortRoomResponse = new SortRoomResponse();
            System.out.println("roomSeq : "+rooms.get(i).getRoomSeq());
            // 각 방마다 인원수를 구해온다.
            int numberOfJoin = roomHistoryService.countJoinUser(rooms.get(i).getRoomSeq());
            System.out.println("참여인원 수 : "+numberOfJoin);
            // List<SortRoomResponse> 에 담아준다.
            sortRoomResponse.setRoomSeq(rooms.get(i).getRoomSeq());
            sortRoomResponse.setType(rooms.get(i).getType());
            // sortRoomResponse.setPassword(rooms.get(i).getPassword()); 비밀번호를 주면 안됨
            sortRoomResponse.setJoinUserNum(numberOfJoin);
            sortRoomResponse.setOwnerId(rooms.get(i).getOwner().getUserId()); // 방장 userId
            sortRoomResponse.setStartTime(rooms.get(i).getStartTime()); // 시작시간
            System.out.println(sortRoomResponse.getStartTime());
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
            int numberOfJoin = roomHistoryService.countJoinUser(rooms.get(i).getRoomSeq());
            System.out.println("참여인원 수 : "+numberOfJoin);
            // List<SearchRoomResponse> 에 담아준다.
            SearchRoomResponse searchRoomResponse = new SearchRoomResponse();
            searchRoomResponse.setRoomSeq(rooms.get(i).getRoomSeq());
            searchRoomResponse.setType(rooms.get(i).getType());
            // searchRoomResponse.setPassword(rooms.get(i).getPassword());
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

    @GetMapping(value = "/pwd", params = {"roomSeq", "password"})
    @ApiOperation(value = "방 비밀번호", notes = "방 입장시 비밀번호 검사")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "비밀번호 불일치"),
            @ApiResponse(code = 403, message = "로그인 안함")
    })
    public ResponseEntity<? extends BaseResponseBody> checkRoomPwd(@ApiIgnore Authentication authentication,
                                                                   @RequestParam Long roomSeq,@RequestParam String password) throws Exception {
        /**
         * 방 비밀번호를 체크한다.
         * 권한 : 해당 유저
         * */
        System.out.println("enterRoom Start ...");

        // 로그인 상태 검사
        if(authentication == null) {
            System.out.println("로그인 상태가 아닙니다.");
            return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
        }
        System.out.println("checkRoomPwd");
        System.out.println("입력한 비밀번호 : "+ password);
        Room room = roomService.findRoomByRoomSeq(roomSeq);

        // 비공개방 패스워드 일치여부 확인
        System.out.println("비공개방이므로 패스워드 일치여부 확인...");
        if(!password.equals(room.getPassword())) {
            System.out.println("비밀번호 불일치");
            return ResponseEntity.status(200).body(BaseResponseBody.of(204, "비밀번호가 일치하지 않습니다."));
        }
        System.out.println("비밀번호 딩동댕");
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }


    @PostMapping(value = "/enter")
    @ApiOperation(value = "방 입장", notes = "방에 들어간다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Contents"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> enterRoom(@ApiIgnore Authentication authentication, @RequestBody EnterRoomRequest enterRoomRequest) {
        /**
         * 해당 방에 입장한다.
         * 권한 : 해당 유저
         * */
        System.out.println("enterRoom Start ...");

        // 로그인 상태 검사
        if(authentication == null) {
            System.out.println("로그인 상태가 아닙니다.");
            return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
        }

        // userId로 userSeq 얻어오기
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        System.out.println("로그인한 유저 name : "+ userDetails.getUsername());
        User user2 = userService.getUserByUserId(userDetails.getUsername());
        System.out.println("userSeq2 : " + user2.getUserSeq());
        System.out.println("roomSeq2 : " + enterRoomRequest.getRoomSeq());
        User user = userDetails.getUser();
        System.out.println("userSeq : "+user.getUserSeq());
        // target room 정보 얻어오기
        Room room = roomService.findRoomByRoomSeq(enterRoomRequest.getRoomSeq());

        // room null 체크
        System.out.println("room ; " + room);
        if(room == null) {
            System.out.println("존재하지 않는 방입니다");
            return ResponseEntity.status(200).body(BaseResponseBody.of(204, "존재하지 않는 방입니다."));
        }
        // 만약 닫힌 방이라면
        if("Y".equals(room.getDelYn())) {
            System.out.println("파티가 종료된 방입니다");
            return ResponseEntity.status(200).body(BaseResponseBody.of(204, "파티가 종료된 방입니다."));
        }

        // 방 중복입장 불가
        RoomHistory roomHistory = roomHistoryService.findOneHistoryAll(user.getUserSeq());
        if(roomHistory != null && "JOIN".equals(roomHistory.getAction().toUpperCase())) {
            return ResponseEntity.status(200).body(BaseResponseBody.of(204, "현재 참여중인 방이 있습니다."));
        }

        // 비공개방일 시 패스워드 일치여부 확인
//        System.out.println("room type "+room.getType());
//        if(room.getType() == 0) {
//            System.out.println("비공개방이므로 패스워드 일치여부 확인...");
//            String password = enterRoomRequest.getPassword();
//            System.out.println("password "+password);
//            if(!password.equals(room.getPassword())) {
//                System.out.println("비밀번호 불일치");
//                return ResponseEntity.status(200).body(BaseResponseBody.of(204, "비밀번호가 일치하지 않습니다."));
//            }
//        }

        // 나갔다 들어온 유저인지 확인
        RoomHistory roomHistoryInTheRoom = roomHistoryService.findOneHistoryInRoom(user.getUserSeq(), room.getRoomSeq());
        // 만약 해당 방에 처음 들어오는 유저라면 새로 쌓아주고
        if(roomHistoryInTheRoom == null) {
            // action:JOIN
            AddHistoryRequest addHistoryRequest = new AddHistoryRequest();
            addHistoryRequest.setRoomSeq(enterRoomRequest.getRoomSeq());
            addHistoryRequest.setUserSeq(user.getUserSeq());
            addHistoryRequest.setAction("JOIN");
            addHistoryRequest.setInsertedTime(LocalDateTime.now());
            roomHistoryService.addHistory(user, room, addHistoryRequest);
        }
        // 들어온 이력이 있는 유저(나갔다 들어오는)라면 exit -> join으로 update 쳐준다.
        else {
            roomHistoryInTheRoom.setAction("JOIN");
            roomHistoryInTheRoom.setUpdatedTime(LocalDateTime.now());
            roomHistoryService.updateRoomAction(roomHistoryInTheRoom);
        }

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

}
