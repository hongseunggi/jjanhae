package com.ssafy.api.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 유저 회원가입 API ([POST] /api/v1/users) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserRegisterPostRequest")
public class UserRegisterPostReq {

	@ApiModelProperty(name="유저 ID", example="ssafy_web")
	String userId;

	@ApiModelProperty(name="유저 이름", example="ssafy_web")
	String name;

	@ApiModelProperty(name="email", example="ssafy_web")
	String email;

	@ApiModelProperty(name="생년월일", example="ssafy_web")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	LocalDate birthday;

	@ApiModelProperty(name="탈퇴여부", example="ssafy_web")
	String delYn;

	@ApiModelProperty(name="프로필 이미지", example="ssafy_web")
	String imageUrl;

	@ApiModelProperty(name="주류", example="ssafy_web")
	String drink;

	@ApiModelProperty(name="주량", example="ssafy_web")
	int drinkLimit;

	@ApiModelProperty(name="인증여부", example="ssafy_web")
	@Column(name = "auth_yn")
	String authYn;

	@ApiModelProperty(name="이메일인증코드", example="ssafy_web")
	String authCode;

	@ApiModelProperty(name="유저 Password", example="your_password")
	String password;

	@ApiModelProperty(name="로그인플랫폼", example="ssafy_web")
	String provider;
}
