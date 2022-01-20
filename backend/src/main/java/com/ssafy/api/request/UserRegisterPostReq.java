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

	@ApiModelProperty(name="유저 ID", example="ssafy1234")
	String userId;

	@ApiModelProperty(name="유저 이름", example="김싸피")
	String name;

	@ApiModelProperty(name="email", example="ssafy1234@ssafy.com")
	String email;

	@ApiModelProperty(name="생년월일", example="1996-01-20")
	@DateTimeFormat(pattern = "yyyy. MM. dd")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy. MM. dd", timezone = "Asia/Seoul")
	LocalDate birthday;

	@ApiModelProperty(name="탈퇴여부", example="N")
	String delYn;

	@ApiModelProperty(name="프로필 이미지", example="images/ssafy_profile.png")
	String imageUrl;

	@ApiModelProperty(name="주류", example="soju")
	String drink;

	@ApiModelProperty(name="주량", example="3")
	int drinkLimit;

	@ApiModelProperty(name="인증여부", example="Y")
	@Column(name = "auth_yn")
	String authYn;

	@ApiModelProperty(name="이메일인증코드", example="224ad")
	String authCode;

	@ApiModelProperty(name="유저 Password", example="ssafy")
	String password;

	@ApiModelProperty(name="로그인플랫폼", example="local")
	String provider;
}
