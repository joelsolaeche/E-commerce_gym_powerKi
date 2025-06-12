package com.uade.tpo.demo.service.implementations;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.service.interfaces.FileUploadService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private static final Logger logger = Logger.getLogger(FileUploadServiceImpl.class.getName());
    private final String UPLOAD_DIR = "src/main/resources/static/uploads"; 

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null) {
            logger.warning("Null file passed to uploadImage");
            return null;
        }
        
        if (file.isEmpty()) {
            logger.warning("Empty file passed to uploadImage");
            return null;
        }

        String originalFilename = file.getOriginalFilename();
        String newFileName = UUID.randomUUID() + "_" + originalFilename;

        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        Path filePath = Paths.get(UPLOAD_DIR, newFileName);
        Files.copy(file.getInputStream(), filePath);
        
        logger.info("Uploaded file to: " + filePath.toString());
        return "/uploads/" + newFileName; 
    }
}
