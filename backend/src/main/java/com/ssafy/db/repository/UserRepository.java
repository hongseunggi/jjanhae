package com.ssafy.db.repository;

import com.ssafy.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


/**
 * 유저 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 아래와 같이, Query Method 인터페이스(반환값, 메소드명, 인자) 정의를 하면 자동으로 Query Method 구현됨.
    Optional<User> findByUserId(String userId);
    Optional<User> findUserByEmail(String email);
    Optional<User> findUserByNameAndEmail(String name, String email);
    Optional<User> findUserByUserIdAndNameAndEmail(String userId, String name, String email);
    void deleteByUserId(String userId);

    @Query(value = "select distinct name from user where user_seq in :userSeqList", nativeQuery = true)
    public List<String> findUserNameByUserSeq(@Param(value = "userSeqList")List<Integer> userSeqList);

    @Query(value = "select * from user where user_seq = :userSeq", nativeQuery = true)
    public User findOneUserByUserSeq(@Param(value = "userSeq") Long userSeq);
}