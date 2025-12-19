package com.medvault.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    private final String BASE_PATH = "C:/medvault/uploads/doctors/";

    // ---------------------------------------------------------
    // 1️⃣ SAVE FILE (doctor registration)
    // ---------------------------------------------------------
    public String saveDoctorFile(Long doctorId, MultipartFile file, String type) throws Exception {

        // Create doctor folder
        String folderPath = BASE_PATH + doctorId + "/";
        File folder = new File(folderPath);

        if (!folder.exists()) {
            folder.mkdirs();
        }

        // Unique file name → degree_1711205583_certificate.pdf
        String fileName = type + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = Path.of(folderPath + fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/doctors/" + doctorId + "/" + fileName;  // store this in DB
    }

    // ---------------------------------------------------------
    // 2️⃣ LOAD FILE (admin preview)
    // ---------------------------------------------------------
    public Resource loadFile(Long doctorId, String type) throws Exception {

        String folderPath = BASE_PATH + doctorId + "/";
        File folder = new File(folderPath);

        if (!folder.exists()) {
            throw new RuntimeException("Folder not found for doctor: " + doctorId);
        }

        // Find file that starts with the prefix "degree", "registration", etc.
        File[] files = folder.listFiles((dir, name) -> name.startsWith(type));

        if (files == null || files.length == 0) {
            throw new RuntimeException("File not found: " + type);
        }

        File file = files[0];

        return new UrlResource(file.toURI());
    }
}
