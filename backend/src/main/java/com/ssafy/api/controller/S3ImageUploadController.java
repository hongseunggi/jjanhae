package com.ssafy.api.controller;


import com.ssafy.api.response.ImgFileResponse;
import com.ssafy.api.service.S3Service;
import com.ssafy.common.model.response.BaseResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/api/v1/img")
public class S3ImageUploadController {

    @Autowired
    private S3Service s3Service;

    @PostMapping(value = "/upload")
    public ResponseEntity<? extends BaseResponseBody> uploadImg(MultipartFile file) throws IOException {
        System.out.println(file);
        String imgUrl = s3Service.uploadImg(file);
        if(imgUrl == null){
            return ResponseEntity.status(200).body(BaseResponseBody.of(400,"Upload Fail"));
        }
        return ResponseEntity.status(200).body(ImgFileResponse.of(200, "Upload Success", imgUrl));
    }
}
