package com.ssafy.api.controller;

import com.ssafy.api.request.ModifyPasswordRequest;
import com.ssafy.api.request.UserInfoPostReq;
import com.ssafy.common.auth.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepositorySupport;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("users")
public class UserController {
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Autowired
	UserService userService;
	
	@PostMapping()
	@ApiOperation(value = "회원 가입", notes = "<strong>아이디와 패스워드</strong>를 통해 회원가입 한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserRegisterPostReq registerInfo) {
		
		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.
		User user = userService.createUser(registerInfo);
		System.out.println("register : "+user.getUserId());

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
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


	@GetMapping("/{userId}")
	@ApiOperation(value = "유저 정보", notes = "존재하는 회원 확인용")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 409, message = "이미 존재하는 유저"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity checkUser(@PathVariable("userId") String userId) {
		/**
		 * 아이디 중복확인
		 * 권한 : 모두사용
		 * 이미 로그인한 사용자가 아닌 경우에만 응답을 하고, 그 외에는 409에러를 발생시킨다.
		 * */
		System.out.println("checkUser : "+userId);
		User user = userService.getUserByUserId(userId);
		System.out.println("이미존재하는 유저입니까? "+user);
		if(user != null) {
			return ResponseEntity.status(409).body(BaseResponseBody.of(409, "이미 존재하는 유저"));
		} else {
			return ResponseEntity.status(200).body(UserRes.of(user));
		}
	}

	@PutMapping(value = "/{userId}")
	@ApiOperation(value = "유저 정보 수정", notes = "유저의 정보를 수정한다")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity modifyUser(@PathVariable("userId") String userId, @RequestBody UserInfoPostReq userInfoPostReq) {
		/**
		 * 권한 : 모두사용
		 * 유저 정보 수정
		 * */
		System.out.println("modifyUser : "+userId);
		String id = userService.update(userId, userInfoPostReq);
		System.out.println("수정완료? "+id);
		if("".equals(id)) {
			// 수정해야할 아이디 존재하지않음
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "수정해야 할 유저 미존재"));
		} else {
			// 수정
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
		}
	}

	@DeleteMapping(value = "/{userId}")
	@ApiOperation(value = "유저 정보 삭제", notes = "유저의 정보를 삭제한다")
	@ApiResponses({
			@ApiResponse(code = 204, message = "성공"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity deleteUser(@ApiIgnore Authentication authentication, @PathVariable("userId") String userId) {
		/**
		 * 권한 : 로그인한 사용자
		 * 유저 정보 삭제
		 * 해당 유저가 생성한 방 모두 삭제
		 * 해당 유저의 지난 회의 이력 모두 삭제
		 * */
		System.out.println("deleteUser : "+userId);

		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		System.out.println("getUserInfo : "+userDetails.getUser());
		userService.delete(userId);
		return ResponseEntity.status(200).body(BaseResponseBody.of(204, "Success"));
	}

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
}
