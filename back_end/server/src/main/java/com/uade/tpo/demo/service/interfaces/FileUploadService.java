package com.uade.tpo.demo.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {
    String uploadImage(MultipartFile file) throws IOException;
}
