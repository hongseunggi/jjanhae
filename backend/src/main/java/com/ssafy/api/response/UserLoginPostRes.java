package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 유저 로그인 API ([POST] /user/login) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("UserLoginPostResponse")
public class UserLoginPostRes extends BaseResponseBody{
	@ApiModelProperty(name="유저 Id", example="ssafy")
	String userId;
	@ApiModelProperty(name="유저 이름", example="김싸피")
	String name;
	@ApiModelProperty(name="유저 이메일", example="ssafy@ssafy.com")
	String email;
	@ApiModelProperty(name="유저 토큰", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.ey")
	String accessToken;
	@ApiModelProperty(name="유저 선호 주종", example="soju")
	String drink;
	@ApiModelProperty(name="유저 주량", example="1")
	Integer drinkLimit;
	@ApiModelProperty(name="유저 생년월일", example="2022. 1 .20")
	LocalDate birthday;
	@ApiModelProperty(name="프로필 링크", example="default.png")
	String imageUrl;
	
	public static UserLoginPostRes of (
			Integer statusCode, String message,
			String userId, String name, String email,
			String accessToken, String drink, Integer drinkLimit,
			LocalDate birthday, String imageUrl) {
		UserLoginPostRes res = new UserLoginPostRes();
		res.setStatusCode(statusCode);
		res.setMessage(message);
		res.setUserId(userId);
		res.setName(name);
		res.setEmail(email);
		res.setAccessToken(accessToken);
		res.setDrink(drink);
		res.setDrinkLimit(drinkLimit);
		res.setBirthday(birthday);
		res.setImageUrl(imageUrl);
		return res;
	}
}
