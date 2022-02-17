package com.ssafy.api.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.annotation.PostConstruct;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;


@Service
@NoArgsConstructor
public class S3Service {
//
    private AmazonS3 s3Client;

    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    @PostConstruct
    public void setS3Client(){
        System.out.println("S3 잘 됩니다~");
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);

        s3Client = AmazonS3ClientBuilder.standard().
                        withCredentials(new AWSStaticCredentialsProvider(credentials)).
                            withRegion(this.region).build();
    }

    public String uploadImg(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        System.out.println(fileName+" "+file.getInputStream().toString());
        //s3Client.putObject(new PutObjectRequest(bucket, fileName, file.getInputStream(), null).withCannedAcl(CannedAccessControlList.PublicRead));
        java.util.Date expiration = new java.util.Date();
        long expTime = expiration.getTime();
        expTime += 1000*60*60;
        expiration.setTime(expTime);
        //presigned url 생성
        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, fileName).withMethod(HttpMethod.PUT).withExpiration(expiration);

        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);

        // http connection으로 직접 put 한다. 버킷 접근 권한 제한 하고도 사용 가능 함 이제!
        byte[] pic = file.getBytes();
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setDoOutput(true);
        connection.setRequestProperty("Content-Type","image");
        connection.setRequestMethod("PUT");
        connection.getOutputStream().write(pic);
        connection.getResponseCode();
        System.out.println("HTTP response code is " + connection.getResponseCode());
        if(connection.getResponseCode() != 200){
            return null;
        }
//        S3Object object = s3Client.getObject(bucket, fileName);
//
//        System.out.println(object.getKey());

        return s3Client.getUrl(bucket, fileName).toString();
    }
}
