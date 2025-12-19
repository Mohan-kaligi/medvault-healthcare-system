package com.medvault.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medvault.backend.model.*;
import com.medvault.backend.repository.*;
import com.medvault.backend.service.FileStorageService;
import com.medvault.backend.model.PasswordResetToken;
import com.medvault.backend.repository.PasswordResetTokenRepository;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    // -------------------------------------------------------------
    // PATIENT REGISTRATION
    // -------------------------------------------------------------
    @PostMapping("/patient/register")
    public Map<String, Object> registerPatient(@RequestBody Patient patientRequest) {

        if (userRepository.findByEmail(patientRequest.getUser().getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        User user = patientRequest.getUser();
        user.setRole(Role.PATIENT);
        user.setEnabled(true);

        userRepository.save(user);

        patientRequest.setUser(user);
        patientRepository.save(patientRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Patient registered successfully");

        return response;
    }

    // -------------------------------------------------------------
    // DOCTOR REGISTRATION WITH FILE UPLOAD
    // -------------------------------------------------------------
    @PostMapping(value = "/doctor/register", consumes = "multipart/form-data")
    public Map<String, Object> doctorRegister(
            @RequestPart("user") String userJson,
            @RequestPart("doctor") String doctorJson,
            @RequestPart("degreeCert") MultipartFile degreeCert,
            @RequestPart("registrationCert") MultipartFile registrationCert,
            @RequestPart("experienceCert") MultipartFile experienceCert,
            @RequestPart("idProof") MultipartFile idProof,
            @RequestPart("photo") MultipartFile photo
    ) throws Exception {

        // 1️⃣ JSON → Objects
        User user = mapper.readValue(userJson, User.class);
        Doctor doctorData = mapper.readValue(doctorJson, Doctor.class);

        // 2️⃣ Check email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        // 3️⃣ Save USER
        // 3️⃣ Save USER
        user.setRole(Role.DOCTOR);
        user.setEnabled(false);
        user.setFirstLogin(true);

// IMPORTANT: temporary password (will be replaced when doctor sets real password)
        user.setPassword("TEMP-PASSWORD");

        userRepository.save(user);  // user.id is now generated

        // 4️⃣ Build DOCTOR (new entity, no id set)
        Doctor doctor = new Doctor();
        doctor.setUser(user);                         // @MapsId will copy user.id into doctor.id
        doctor.setSpecialization(doctorData.getSpecialization());
        doctor.setExperienceYears(doctorData.getExperienceYears());
        doctor.setHospitalName(doctorData.getHospitalName());
        doctor.setLicenseNumber(doctorData.getLicenseNumber());
        doctor.setDeclarationAccepted(doctorData.isDeclarationAccepted());
        doctor.setStatus(DoctorStatus.PENDING);

        // 5️⃣ Save files first (we know user.getId())
        Long doctorId = user.getId();

        String degreePath = fileStorageService.saveDoctorFile(user.getId(), degreeCert, "degree");
        String regPath = fileStorageService.saveDoctorFile(user.getId(), registrationCert, "registration");
        String expPath = fileStorageService.saveDoctorFile(user.getId(), experienceCert, "experience");
        String idPath = fileStorageService.saveDoctorFile(user.getId(), idProof, "idproof");
        String photoPath = fileStorageService.saveDoctorFile(user.getId(), photo, "photo");


        doctor.setDegreeCertPath(degreePath);
        doctor.setRegistrationCertPath(regPath);
        doctor.setExperienceCertPath(expPath);
        doctor.setIdProofPath(idPath);
        doctor.setPhotoPath(photoPath);

        // 6️⃣ Save DOCTOR only once
        doctorRepository.save(doctor);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Doctor request submitted. Await admin approval.");
        return response;
    }


    // -------------------------------------------------------------
    // LOGIN
    // -------------------------------------------------------------
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Account disabled. Admin approval required.");
        }

        Map<String, Object> res = new HashMap<>();
        res.put("id", user.getId());
        res.put("role", user.getRole());
        res.put("firstLogin", user.isFirstLogin());
        res.put("fullName", user.getFullName());
        res.put("email", user.getEmail());
        res.put("phone", user.getPhone());

        return res;



    }
    // -------------------------------------------------------------
// SET PASSWORD (from email link)
// -------------------------------------------------------------
    @PostMapping("/set-password")
    public Map<String, String> setPassword(@RequestBody Map<String, String> request) {

        String token = request.get("token");
        String newPassword = request.get("password");

        // 1) Validate token
        PasswordResetToken reset = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        // 2) Check expiration
        if (reset.getExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        // 3) Update password
        User user = reset.getUser();
        user.setPassword(newPassword);
        user.setEnabled(true);
        user.setFirstLogin(false);

        userRepository.save(user);

        // 4) Delete token so it cannot be reused
        passwordResetTokenRepository.delete(reset);

        return Map.of("message", "Password successfully updated");
    }


}
