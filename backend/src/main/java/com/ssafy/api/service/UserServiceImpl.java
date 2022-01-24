package com.ssafy.api.service;


import com.ssafy.api.request.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserSignupPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserRepositorySupport userRepositorySupport;

    @Autowired
    PasswordEncoder passwordEncoder;

    // 회원가입
    @Override
    public User createUser(UserSignupPostReq userSignupInfo) {
        User user = new User();
        user.setUserId(userSignupInfo.getUserId());
        // 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
        user.setPassword(passwordEncoder.encode(userSignupInfo.getPassword()));
        user.setName(userSignupInfo.getName());
        user.setEmail(userSignupInfo.getEmail());
        user.setBirthday(userSignupInfo.getBirthday());
        user.setDrink(userSignupInfo.getDrink());
        user.setDrinkLimit(userSignupInfo.getDrinkLimit());
        user.setImageUrl("default");
        user.setAuthYn("Y");
        user.setAuthCode(userSignupInfo.getAuthCode());
        user.setDelYn("N");
        user.setProvider("local");
        return userRepository.save(user);
    }

    // 아이디 중복 확인
    @Override
    public User getUserByUserId(String userId) {
        // 디비에 유저 정보 조회 (userId 를 통한 조회).
        System.out.println("====== getUserByUserId =====");
        System.out.println("userId : "+userId);
        Optional<User> res = userRepositorySupport.findUserByUserId(userId);
        User user = null;
        if(res.isPresent()){
            user = res.get();
        }
        System.out.println("user : " + user);
        return user;
    }

    // 이메일 중복 확인
    @Override
    public User getUserByEmail(String email) {
        // 디비에 유저 정보 조회 (userId 를 통한 조회).
        System.out.println("====== getUserByEmail =====");
        System.out.println("email : "+email);
        Optional<User> res = userRepositorySupport.findUserByEmail(email);
        User user = null;
        if(res.isPresent()){
            user = res.get();
        }
        System.out.println("user : " + user);
        return user;
    }

    // 아이디 찾기
    @Override
    public User getUserByNameAndEmail(String name, String email) {
        System.out.println("====== getUserByNameAndEmail =====");
        System.out.printf("name : %s, eamil : %s\n", name, email);
        Optional<User> res = userRepositorySupport.findUserByNameAndEmail(name, email);
        User user = null;
        if(res.isPresent()) {
            user = res.get();
        }
        return user;
    }

    // 비밀번호 찾기
    @Override
    public User getUserByUserIdAndNameAndEmail(String userId, String name, String email) {
        System.out.println("====== getUserByUserIdAndNameAndEmail =====");
        System.out.printf("userId : %s, name : %s, eamil : %s\n", userId, name, email);
        Optional<User> res = userRepositorySupport.findUserByUserIdAndNameAndEmail(userId, name, email);
        User user = null;
        if(res.isPresent()) {
            user = res.get();
        }
        return user;
    }

    // 회원 수정
    @Override
    @Transactional
    public String updateUserProfile(String userId, UserProfilePutReq userProfilePutReq) {
        Optional<User> res = userRepositorySupport.findUserByUserId(userId);
        if(res.isPresent()) {
            User user = res.get();
		    user.setName(userProfilePutReq.getName());
            user.setEmail(userProfilePutReq.getEmail());
            user.setBirthday(userProfilePutReq.getBirthday());
            user.setDrink(userProfilePutReq.getDrink());
            user.setDrinkLimit(userProfilePutReq.getDrinkLimit());
            userRepository.save(user);
            return userId;
        }
        return null;
    }


    // 비번 수정
    @Override
    public int updatePassword(String userId, ModifyPasswordRequest modifyPasswordRequest) {
        Optional<User> res = userRepositorySupport.findUserByUserId(userId);
        User user = null;
        if(res.isPresent()) {
            user = res.get();
            user.setPassword(passwordEncoder.encode(modifyPasswordRequest.getPassword()));
            userRepository.save(user);
            return 1;
        }
        return 0;
    }

    // 회원 탈퇴
    @Override
    @Transactional
    public void disable(String userId) {
        Optional<User> res = userRepositorySupport.findUserByUserId(userId);
        User user = null;
        if(res.isPresent()) {
            user = res.get();
            System.out.println(user);
            user.setDelYn("Y");
            userRepository.save(user);
        }
    }

}
