package com.ssafy.api.controller;


import com.ssafy.api.request.*;
import com.ssafy.api.response.*;
import com.ssafy.api.service.EmailService;
import com.ssafy.api.service.RoomHistoryService;
import com.ssafy.api.service.RoomService;
import com.ssafy.common.auth.JwtAuthenticationFilter;
import com.ssafy.db.entity.AuthEmail;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.User;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.annotations.ApiIgnore;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Autowired
	UserService userService;

	@Autowired
	EmailService emailService;

	@Autowired
	RoomService roomService;

	@Autowired
	RoomHistoryService roomHistoryService;

	@PostMapping("/signup")
	@ApiOperation(value = "회원 가입", notes = "<strong>아이디와 패스워드</strong>를 통해 회원가입 한다.")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 409, message = "이미 사용한 정보"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<? extends BaseResponseBody> signup(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserSignupPostReq signupInfo) {

		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.


		System.out.println("=========== 회원가입 ===========\n");
		System.out.println("아이디 : " + signupInfo.getUserId());
		System.out.println("생년월일 : " + signupInfo.getBirthday());
		User user = userService.getUserByUserId(signupInfo.getUserId());
		System.out.println("user : " + user);
		if(user != null){
			return ResponseEntity.status(409).body(BaseResponseBody.of(409, "이미 존재하는 사용자 ID"));
		}
		User res = userService.createUser(signupInfo);
		System.out.println("인증 여부 : " + signupInfo.getAuthYn());
		System.out.println("userId : " + res.getUserId());
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "회원가입 성공!"));
	}

	@GetMapping(value = "", params = "userId")
	@ApiOperation(value = "아이디", notes = "존재하는 회원 확인용")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 409, message = "이미 존재하는 회원"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<BaseResponseBody> checkId(@RequestParam String userId) {
		/**
		 * 아이디 중복확인
		 * 권한 : 모두사용
		 * */
		System.out.println("checkId : "+ userId);
		User user = userService.getUserByUserId(userId);
		System.out.println("user " + user);
		if(user != null) {
			return ResponseEntity.status(409).body(BaseResponseBody.of(409, "해당 아이디는 이미 사용중입니다."));
		} else {
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "사용가능한 아이디입니다."));
		}
	}

	@PostMapping(value = "")
	@ApiOperation(value = "이메일 중복확인", notes = "존재하는 회원 확인용")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 409, message = "이미 존재하는 회원"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<BaseResponseBody> checkEmail(@RequestBody HashMap<String, Object> inputEmail) throws Exception {
		/**
		 * 이메일 중복확인
		 * 권한 : 모두사용
		 * */
		String email = (String) inputEmail.get("email");
		System.out.println("이 이메일 사용중인가요? : "+ email);
		User user = userService.getUserByEmail(email);
		if(user != null) {
			// 해당 이메일을 사용하는 유저가 있다.
			return ResponseEntity.status(409).body(BaseResponseBody.of(409, "해당 이메일은 이미 사용중입니다."));
		} else {
			// 해당 이메일을 사용하는 유저가 없다.
			System.out.println("안쓰는 이메일입니다.");
			// 인증코드 만들기
			String authCode = emailService.sendAuthCode(email);
			AuthEmail authEmail = emailService.getAuthEmailByEmail(email);
			if (authEmail != null) {
				// 해당 이메일을 이미 인증하려한 시도가 있다면 authCode만 업데이트
				System.out.println("인증을 시도했었어요. 코드만 업데이트 할게요.");
				emailService.updateAuthEmail(email, authCode);
			} else {
				// 해당 이메일을 인증하려한 기록이 없다면 새로 데이터 추가
				System.out.println("인증을 시도한적이 없네요!");
				emailService.createAuthEmail(email, authCode);
			}
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "인증번호를 발송했습니다."));
		}
	}

	@GetMapping(value = "", params = {"email", "authCode"})
	@ApiOperation(value = "이메일 인증", notes = "이메일과 인증코드 일치 여부 확인")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "사용자 없음 또는 인증코드 일치 안함"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<BaseResponseBody> checkEmailIsAuth(@RequestParam String email, String authCode) throws Exception {
		/**
		 * 이메일 인증 여부 확인
		 * 권한 : 모두사용
		 * */
		AuthEmail authEmail = emailService.getAuthEmailByEmail(email);
		if(authEmail == null) {
			// 해당하는 이메일이 없을 때
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "유효하지 않은 정보입니다."));
		}
		if(!Objects.equals(authEmail.getAuthCode(), authCode)) {
			// 인증 코드가 틀렸을 때
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "유효하지 않은 정보입니다."));
		}
		// 인증 완료, 완료된 이메일은 DB에서 삭제
		emailService.deleteAuthEmail(authEmail);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "이메일 인증 완료."));
	}


	@PatchMapping("/id")
	@ApiOperation(value = "이메일 인증(코드)", notes = "아이디를 찾기 위해 이메일로 인증코드를 보낸다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "존재하지 않는 사용자"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<BaseResponseBody> findId(
			@RequestBody @ApiParam(value="아이디찾기 이메일인증 정보", required = true) FindIdRequest findIdRequest)  throws Exception {

		System.out.println("=========== 이메일 인증(코드)으로 아이디 찾기 ===========");
		// 이름, 이메일이 일치한 회원이 있는지 확인
		User user = userService.getUserByNameAndEmail(findIdRequest.getName(), findIdRequest.getEmail());
		if(user == null) {
			System.out.println("존재하지 않는 사용자입니다.");
			// 존재하지 않는 사용자입니다.
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "인증번호를 발송했습니다. 이메일이 도착하지 않았다면 입력한 정보를 다시 확인해주세요."));
		}
		System.out.println("유효한 사용자");
		// 이메일 전송
		String authCode = emailService.sendSimpleMessage(findIdRequest);
		// authCode 갱신
		userService.updateUserAuthCode(user, authCode);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "인증번호를 발송했습니다. 이메일이 도착하지 않았다면 입력한 정보를 다시 확인해주세요."));

	}


	@GetMapping(value = "/id", params = {"name", "email", "authCode"})
	@ApiOperation(value = "이메일 인증(코드)", notes = "전달받은 인증코드로 사용자의 id를 찾아준다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "존재하지 않는 사용자"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> findId(
			@RequestParam @ApiParam(value="아이디찾기 이메일인증 정보", required = true) String name, String email, String authCode)  throws Exception {

		System.out.println("=========== 입력받은 코드로 아이디 찾기 ===========");
		// 이름, 이메일이 일치한 회원이 있는지 확인
		User user = userService.getUserByNameAndEmail(name, email);
		if(user == null) {
			System.out.println("존재하지 않는 사용자입니다.");
			// 존재하지 않는 사용자입니다.
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "입력한 정보가 일치하지 않습니다."));
		}
		System.out.println("유효한 사용자");
		// 인증코드 일치 여부 확인
		if(!Objects.equals(authCode, user.getAuthCode())) {
			System.out.println("근데 코드가 틀림");
			// 일치하지 않는다면
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "입력한 정보가 일치하지 않습니다."));
		}
		// 사용자도 존재하고 인증코드도 일치한다면 성공!
		return ResponseEntity.status(200).body(FindIdResponse.of(200, "인증되었습니다.", user.getUserId()));

	}




	@PatchMapping("/pwd")
	@ApiOperation(value = "이메일 인증(버튼)", notes = "비밀번호 찾기 위해 이메일로 버튼을 보낸다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "존재하지 않는 사용자"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<?> findPwd(
			@RequestBody FindPwdRequest findPwdRequest)  throws Exception {

		System.out.println("=========== 이메일 인증(버튼)으로 비밀번호 찾기 ===========");
		// 아이디, 이름, 이메일이 일치한 회원이 있는지 확인
		User user = userService.getUserByUserIdAndEmail(findPwdRequest.getUserId(), findPwdRequest.getEmail());
		if(user == null) {
			System.out.println("존재하지 않는 사용자입니다.");
			// 유효하지 않은 사용자입니다.
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "인증번호를 발송했습니다. 이메일이 도착하지 않았다면 입력한 정보를 다시 확인해주세요."));
		}
		System.out.println("유효한 사용자");
		// 이메일 전송 (버튼 url)
		String authCode = emailService.sendSimpleMessageButton(findPwdRequest);
		// authCode 갱신
		userService.updateUserAuthCode(user, authCode);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "인증번호를 발송했습니다. 이메일이 도착하지 않았다면 입력한 정보를 다시 확인해주세요."));
		
	}

	@PatchMapping("/newpwd")
	@ApiOperation(value = "이메일 인증(버튼)", notes = "전달받은 인증코드로 사용자의 pwd를 재설정함")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "비밀번호 변경 실패"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<BaseResponseBody> resetPwd(@RequestBody PwdPatchRequest pwdPatchRequest)  throws Exception {
		/**
		 * 권한 : 모두사용
		 * 유저 정보 수정
		 * */
		System.out.println("=========== 비밀번호 수정 ===========");
		// 이름, 이메일이 일치한 회원이 있는지 확인
		User user = userService.getUserByUserId(pwdPatchRequest.getUserId());
		if(user == null) {
			System.out.println("존재하지 않는 사용자입니다.");
			// 존재하지 않는 사용자입니다.
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "입력한 정보가 일치하지 않습니다."));
		}
		System.out.println("유효한 사용자");
		// 인증코드 일치 여부 확인
		if(!Objects.equals(pwdPatchRequest.getAuthCode(), user.getAuthCode())) {
			System.out.println("근데 코드가 틀림");
			// 일치하지 않는다면
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "입력한 정보가 일치하지 않습니다."));
		}
		// 사용자도 존재하고 인증코드도 일치한다면 성공!
		userService.updateUserPassword(pwdPatchRequest.getUserId(), pwdPatchRequest.getPassword());
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "비밀번호 재설정이 완료되었습니다."));

	}


	@GetMapping("/profile")
	@ApiOperation(value = "회원 본인 정보 조회", notes = "파라미터에 입력된 userId 회원의 정보를 응답한다.")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 403, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<? extends BaseResponseBody> getUserInfo(@ApiIgnore Authentication authentication) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 * 유저 프로필 정보를 조회한다.
		 * 권한 : 로그인한 유저
		 */
		if(authentication == null){
			System.out.println("얘 토큰 없다");
			return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
		}
		// 토큰이 있는 유저라면
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		System.out.println("로그인한 유저 : "+ userDetails.getUser());
		User user = userService.getUserByUserId(userDetails.getUsername());
		if(user == null){
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "해당 사용자가 존재하지 않습니다."));
		}
		System.out.println("조회하려는 유저: " + user);

		return ResponseEntity.ok(UserProfileRes.of(200, "조회에 성공하였습니다.", user));
	}



	@PatchMapping(value = "/profile")
	@ApiOperation(value = "유저 정보 수정", notes = "이름, 이메일, 생일, 주종, 주량을 수정한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 403, message = "권한 없음"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<BaseResponseBody> updateUserProfile(@ApiIgnore Authentication authentication,  @RequestBody UserProfilePatchReq userProfilePatchReq) {
		/**
		 * 유저 프로필 정보 수정(이름, 이메일, 생일, 주종, 주량을 수정한다.
		 * 권한 : 해당 유저
		 * */
		if(authentication == null){
			System.out.println("얘 토큰 없다!!");
			return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
		}
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		// 토큰에서 사용자 정보를 가져왔으니 이게 비어있을린 없다!
		User user = userDetails.getUser();
//		System.out.println("????????????????????????????????????");
		if(userProfilePatchReq.getName() == null || userProfilePatchReq.getBirthday() == null) {
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "유효하지 않은 값을 입력했습니다."));
		}
		// birthday 형식 안맞을땐 어떻게 막아야 하는지 모르겠어ㅠㅠ
		userService.updateUserProfile(user.getUserId(), userProfilePatchReq);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "회원 정보가 수정되었습니다."));
	}

	@PatchMapping(value = "/profileimg")
	@ApiOperation(value = "유저 정보 수정", notes = "이름, 이메일, 생일, 주종, 주량을 수정한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 403, message = "권한 없음"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<BaseResponseBody> updateUserProfileImg(@ApiIgnore Authentication authentication, @RequestBody UserProfileImgPatchReq userProfileImgPatchReq) {
		/**
		 * 유저 프로필 정보 수정(이름, 이메일, 생일, 주종, 주량을 수정한다.
		 * 권한 : 해당 유저
		 * */
		if(authentication == null){
			System.out.println("얘 토큰 없다!!");
			return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
		}
		// 토큰에서 사용자 정보를 가져왔으니 이게 비어있을린 없다!
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		System.out.println(userProfileImgPatchReq.getImageUrl());
		if(userProfileImgPatchReq.getImageUrl().equals("")) {
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "유효하지 않은 값을 입력했습니다."));
		}
		userService.updateUserProfileImg(userDetails.getUsername(), userProfileImgPatchReq.getImageUrl());
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "프로필 이미지가 수정되었습니다."));
	}



	@DeleteMapping(value = "")
	@ApiOperation(value = "회원 탈퇴", notes = "유저를 비활성화 한다.")
	@ApiResponses({
			@ApiResponse(code = 204, message = "성공"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity deleteUser(@ApiIgnore Authentication authentication) {
		/**
		 * 유저 정보 수정 - disable
		 * 권한 : 로그인한 사용자 본인
		 * 해당 유저가 생성한 방 모두 삭제 안됨
		 * 해당 유저의 지난 회의 이력 모두 삭제 안됨
		 * */
		if(authentication == null){
			System.out.println("얘 토큰 없다!!");
			return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
		}
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		userService.disableUser(userDetails.getUsername());
		return ResponseEntity.status(204).body(BaseResponseBody.of(204, "회원 탈퇴 완료"));
	}



	@GetMapping(value = "/conferences", params = "month")
	@ApiOperation(value = "이번달 파티 조회", notes = "로그인한 회원이 참여한 파티 목록을 조회한다")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 204, message = "데이터 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> getConferencesDate(@ApiIgnore Authentication authentication, @RequestParam @ApiParam(value="이번 달 정보", required = true) String month)  throws Exception {
		if(authentication == null){
			System.out.println("인증 실패");
			return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
		}
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		User user = userDetails.getUser();

		List<RoomHistory> roomList = roomHistoryService.getAllList(user.getUserSeq());
		List<LocalDate> conferencesDateList = new ArrayList<>();
		for(int i=0; i<roomList.size(); i++) {
			conferencesDateList.add(roomList.get(i).getInsertedTime());
		}

		return ResponseEntity.status(200).body(ConferencesGetRes.of(204, "파티리스트 조회 성공", conferencesDateList));
	}


	@GetMapping(value = "/conferences", params = "date")
	@ApiOperation(value = "특정 날짜 파티 목록 조회", notes = "선택한 날짜에 진행된 파티 목록 조회")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 204, message = "데이터 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> getConferencesList(@ApiIgnore Authentication authentication, @RequestParam @ApiParam(value="날짜 정보", required = true) String date)  throws Exception {
		System.out.println(date);

		if(authentication == null){
			System.out.println("인증 실패");
			return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
		}
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		User user = userDetails.getUser();

		List<Room> roomList = roomService.getRoomList(user.getUserSeq());
		List<LocalDate> conferencesDateList = new ArrayList<>();
		for(int i=0; i<roomList.size(); i++) {
			System.out.println(roomList.get(i));
		}

		return ResponseEntity.status(200).body(ConferencesGetRes.of(204, "파티리스트 조회 성공", conferencesDateList));
	}


}
