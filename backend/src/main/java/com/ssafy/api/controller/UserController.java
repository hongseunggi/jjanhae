package com.ssafy.api.controller;


import com.ssafy.api.request.*;
import com.ssafy.api.response.*;
import com.ssafy.api.service.EmailService;
import com.ssafy.common.auth.JwtAuthenticationFilter;
import com.ssafy.db.entity.AuthEmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import retrofit2.http.Path;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/user")
public class UserController {
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Autowired
	UserService userService;

	@Autowired
	EmailService emailService;

	@PostMapping("/signup")
	@ApiOperation(value = "회원 가입", notes = "<strong>아이디와 패스워드</strong>를 통해 회원가입 한다.")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<? extends BaseResponseBody> signup(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserSignupPostReq signupInfo) {

		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.

		System.out.println("=========== 회원가입 ===========\n");
		System.out.println("아이디 : " + signupInfo.getUserId());
		User user = userService.getUserByUserId(signupInfo.getUserId());
		System.out.println("user : " + user);
		if(user != null){
			return ResponseEntity.status(409).body(BaseResponseBody.of(409, "이미 존재하는 사용자 ID"));
		}
		User res = userService.createUser(signupInfo);
		System.out.println("인증 여부 : " + signupInfo.getAuthYn());
		System.out.println("userId : " + res.getUserId());
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
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
				emailService.updateAuthEmail(email, authCode);
			} else {
				// 해당 이메일을 인증하려한 기록이 없다면 새로 데이터 추가
				emailService.createAuthEmail(email, authCode);
			}
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "인증번호를 발송했습니다."));
		}
	}

	@GetMapping(value = "", params = {"email", "authCode"})
	@ApiOperation(value = "이메일 인증", notes = "이메일과 인증코드 일치 여부 확인")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "사용자 없음 또는 인증코드 일치 안함"),
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
			return ResponseEntity.status(409).body(BaseResponseBody.of(401, "유효하지 않은 정보입니다."));
		}
		if(!Objects.equals(authEmail.getAuthCode(), authCode)) {
			// 인증 코드가 틀렸을 때
			return ResponseEntity.status(409).body(BaseResponseBody.of(401, "유효하지 않은 정보입니다."));
		}
		// 인증 완료, 완료된 이메일은 DB에서 삭제
		emailService.deleteAuthEmail(authEmail);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "이메일 인증 완료."));
	}




	@GetMapping("/findid")
	@ApiOperation(value = "이메일 인증(코드)", notes = "이메일로 인증코드를 보낸다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "존재하지 않는 사용자"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<FindIdResponse> findId(
			@RequestBody @ApiParam(value="아이디찾기 이메일인증 정보", required = true) FindIdRequest findIdRequest)  throws Exception {

		System.out.println("=========== 이메일 인증(코드)으로 아이디 찾기 ===========");
		// 이름, 이메일이 일치한 회원이 있는지 확인
		User user = userService.getUserByNameAndEmail(findIdRequest.getName(), findIdRequest.getEmail());
		if(user != null) {
			System.out.println("유효한 사용자");
			// 이메일 전송
			String authCode = emailService.sendSimpleMessage(findIdRequest);
			return ResponseEntity.ok(FindIdResponse.of(200, "Success", authCode, user.getUserId()));
		} else {
			System.out.println("유효하지 사용자");
			// 유효하지 않은 사용자입니다.
			return ResponseEntity.status(404).body(FindIdResponse.of(401, "유효하지 않은 사용자", null, null));
		}

	}

	@GetMapping("/findpwd")
	@ApiOperation(value = "이메일 인증(버튼)", notes = "이메일로 인증 url를 보낸다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "존재하지 않는 사용자"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<?> findPwd(
			@RequestBody FindPwdRequest findPwdRequest)  throws Exception {

		System.out.println("=========== 이메일 인증(버튼)으로 비밀번호 찾기 ===========");
		// 아이디, 이름, 이메일이 일치한 회원이 있는지 확인
		User user = userService.getUserByUserIdAndNameAndEmail(findPwdRequest.getUserId(), findPwdRequest.getName(), findPwdRequest.getEmail());
		if(user != null) {
			System.out.println("유효한 사용자");
			// 이메일 전송 (버튼 url)
			String authCode = emailService.sendSimpleMessageButton(findPwdRequest);
			return ResponseEntity.status(200).body(FindPwdResponse.of("Success", authCode, findPwdRequest.getUserId()));
		} else {
			System.out.println("유효하지 사용자");
			// 유효하지 않은 사용자입니다.
			return ResponseEntity.status(404).body(BaseResponseBody.of(401, "유효하지 않은 사용자"));
		}

	}

	@GetMapping("/me")
	@ApiOperation(value = "회원 본인 정보 조회", notes = "로그인한 회원 본인의 정보를 응답한다.")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<UserRes> getUserInfo(@ApiIgnore Authentication authentication) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		System.out.println("getUserInfo : "+userDetails.getUser());
		String userId = userDetails.getUsername();
		User user = userService.getUserByUserId(userId);

		return ResponseEntity.status(200).body(UserRes.of(user));
	}




//	@PatchMapping(value = "/{userId}/modify")
//	@ApiOperation(value = "유저 정보 수정", notes = "이름, 이메일, 생일, 주종, 주량을 수정한다.")
//	@ApiResponses({
//			@ApiResponse(code = 200, message = "성공"),
//			@ApiResponse(code = 404, message = "사용자 없음"),
//			@ApiResponse(code = 500, message = "서버 오류")
//	})
//	public ResponseEntity<BaseResponseBody> updateUser(@ApiIgnore Authentication authentication, @PathVariable("userId") String userId,  @RequestBody UserProfilePutReq userProfilePutReq) {
//		/**
//		 * 유저 프로필 정보 수정(이름, 이메일, 생일, 주종, 주량을 수정한다.
//		 * 권한 : 해당 유저
//		 * */
////		System.out.println("modifyUser : "+userId);
////		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
////		System.out.println("getUserInfo : "+userDetails.getUser());
//		String id = userService.updateUserProfile(userId, userProfilePutReq);
////		System.out.println("수정완료? "+id);
//		if("".equals(id)) {
//			// 수정해야할 아이디 존재하지않음
//			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "해당 사용자가 존재하지 않습니다."));
//		} else {
//			// 수정
//			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
//		}
//	}

	@PatchMapping(value = "/modifypwd")
	@ApiOperation(value = "비밀번호 수정", notes = "유저의 비밀번호를 수정한다")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "비밀번호 변경 실패"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<?> modifyUser(@RequestBody ModifyPasswordRequest modifyPasswordRequest) {
		/**
		 * 권한 : 모두사용
		 * 유저 정보 수정
		 * */
		System.out.println("modifyUser : " + modifyPasswordRequest.getUserId());
		int res = userService.updatePassword(modifyPasswordRequest.getUserId(), modifyPasswordRequest);
		if(res == 0) {
			// 수정 실패
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "비밀번호 변경 실패"));
		} else {
			// 수정
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
		}
	}

//	@DeleteMapping(value = "/{userId}")
//	@ApiOperation(value = "유저 정보 삭제", notes = "유저의 정보를 삭제한다")
//	@ApiResponses({
//			@ApiResponse(code = 204, message = "성공"),
//			@ApiResponse(code = 404, message = "사용자 없음"),
//			@ApiResponse(code = 500, message = "서버 오류")
//	})
//	public ResponseEntity deleteUser(@ApiIgnore Authentication authentication, @PathVariable("userId") String userId) {
//		/**
//		 * 유저 정보 수정 - disable, 사실 지우는게 아니라 delete로 맵핑해도 되는가에 대한 의문?
//		 * 권한 : 로그인한 사용자 본인
//		 * 해당 유저가 생성한 방 모두 삭제 안됨
//		 * 해당 유저의 지난 회의 이력 모두 삭제 안됨
//		 * */
//		System.out.println("deleteUser : "+userId);
//
////		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
////		System.out.println("getUserInfo : "+userDetails.getUser());
//		userService.disable(userId);
//		return ResponseEntity.status(200).body(BaseResponseBody.of(204, "disable 처리"));
//	}
}
