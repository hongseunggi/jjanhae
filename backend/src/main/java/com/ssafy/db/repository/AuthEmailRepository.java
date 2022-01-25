package com.ssafy.db.repository;

import com.ssafy.db.entity.AuthEmail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthEmailRepository extends JpaRepository<AuthEmail, Long> {
    Optional<AuthEmail> findAuthEmailByEmail(String email);
}
