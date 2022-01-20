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
	@ApiModelProperty(name="JWT 인증 토큰", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN...")
	String userId;
	String name;
	String email;
	String accessToken;
	String drink;
	Integer drinkLimit;
	LocalDate birthday;
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
