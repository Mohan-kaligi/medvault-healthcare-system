package com.medvault.backend.controller;

import com.medvault.backend.model.Doctor;
import com.medvault.backend.model.DoctorStatus;
import com.medvault.backend.model.PasswordResetToken;
import com.medvault.backend.repository.DoctorRepository;
import com.medvault.backend.repository.PasswordResetTokenRepository;
import com.medvault.backend.repository.UserRepository;
import com.medvault.backend.service.FileStorageService;
import com.medvault.backend.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private MailService mailService;

    // All doctors
    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @GetMapping("/doctors/pending")
    public List<Doctor> getPendingDoctors() {
        return doctorRepository.findByStatus(DoctorStatus.PENDING);
    }

    @GetMapping("/doctors/approved")
    public List<Doctor> getApprovedDoctors() {
        return doctorRepository.findByStatus(DoctorStatus.APPROVED);
    }

    @GetMapping("/doctors/rejected")
    public List<Doctor> getRejectedDoctors() {
        return doctorRepository.findByStatus(DoctorStatus.REJECTED);
    }

    // Approve doctor + create token + send email
    @PutMapping("/doctor/approve/{id}")
    public Map<String, Object> approveDoctor(@PathVariable Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Update doctor & user status
        doctor.setStatus(DoctorStatus.APPROVED);
        doctor.getUser().setEnabled(false); // enable only after password set
        doctorRepository.save(doctor);
        userRepository.save(doctor.getUser());

        // Create password reset token
        PasswordResetToken token = new PasswordResetToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(doctor.getUser());
        token.setExpiry(LocalDateTime.now().plusHours(24));

        passwordResetTokenRepository.save(token);

        // Email link
        String link = "http://localhost:3000/set-password?token=" + token.getToken();

        String msg = "Hello Dr. " + doctor.getUser().getFullName() +
                ",\n\nYour account has been APPROVED.\n" +
                "Please set your password using the link below:\n\n" +
                link + "\n\nRegards,\nMedVault Team";

        mailService.sendEmail(doctor.getUser().getEmail(), "MedVault - Account Approved", msg);

        return Map.of("message", "Doctor Approved & Email Sent");
    }



    // Reject doctor
    @PutMapping("/doctor/reject/{id}")
    public Map<String, Object> rejectDoctor(@PathVariable Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setStatus(DoctorStatus.REJECTED);
        doctor.getUser().setEnabled(false);

        doctorRepository.save(doctor);
        userRepository.save(doctor.getUser());

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Doctor Rejected Successfully");

        return res;
    }

    // Serve doctor files (degree, registration, experience, idproof, photo)
    @GetMapping("/doctor/file/{doctorId}/{type}")
    public ResponseEntity<Resource> getDoctorFile(
            @PathVariable Long doctorId,
            @PathVariable String type) throws Exception {

        Resource file = fileStorageService.loadFile(doctorId, type);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + type + "\"")
                .body(file);
    }
}
