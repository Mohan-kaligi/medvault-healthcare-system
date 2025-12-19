package com.medvault.backend.controller;
import java.util.Map;
import java.util.HashMap;

import com.medvault.backend.dto.DoctorDashboardDTO;
import com.medvault.backend.dto.DoctorPublicDTO;
import com.medvault.backend.model.Doctor;
import com.medvault.backend.model.DoctorStatus;
import com.medvault.backend.model.User;
import com.medvault.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin("*")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    @Value("${app.file-base-url:http://localhost:8080}")
    private String fileBaseUrl;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // Helper to build full photo URL
    private String buildPhotoUrl(String photoPath) {
        if (photoPath == null || photoPath.isBlank()) return null;

        if (photoPath.startsWith("http")) {
            return photoPath;
        } else if (photoPath.startsWith("/")) {
            return fileBaseUrl + photoPath;
        } else {
            return fileBaseUrl + "/" + photoPath;
        }
    }

    // 🔹 Used by Doctor Dashboard + Patient Doctor Profile
    @GetMapping("/{id}")
    public DoctorDashboardDTO getDoctorDashboard(@PathVariable Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        User u = doctor.getUser();

        DoctorDashboardDTO dto = new DoctorDashboardDTO();
        dto.setId(u.getId());
        dto.setFullName(u.getFullName());
        dto.setEmail(u.getEmail());
        dto.setPhone(u.getPhone());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setHospitalName(doctor.getHospitalName());
        dto.setExperienceYears(doctor.getExperienceYears());
        dto.setLicenseNumber(doctor.getLicenseNumber());
        dto.setPhotoUrl(buildPhotoUrl(doctor.getPhotoPath()));

        dto.setAbout(doctor.getAbout());
        dto.setExpertise(doctor.getExpertise());
        dto.setAvailability(doctor.getAvailability());

        dto.setTotalPatients(23L);
        dto.setTodaysAppointments(5L);
        dto.setPendingAppointments(2L);

        return dto;
    }
    @PutMapping("/{id}/update-profile")
    public Map<String, String> updateDoctorProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Update fields
        doctor.setAbout(body.get("about"));
        doctor.setExpertise(body.get("expertise"));
        doctor.setAvailability(body.get("availability"));

        doctorRepository.save(doctor);

        return Map.of("message", "Profile updated successfully");
    }

    // 🔹 NEW: list of APPROVED doctors for patient search
    @GetMapping("/public")
    public List<DoctorPublicDTO> listApprovedDoctors(
            @RequestParam(required = false) String specialization
    ) {
        List<Doctor> doctors = doctorRepository.findByStatus(DoctorStatus.APPROVED);

        String specFilter = specialization != null ? specialization.toLowerCase() : null;

        return doctors.stream()
                .filter(d -> specFilter == null ||
                        (d.getSpecialization() != null &&
                                d.getSpecialization().toLowerCase().contains(specFilter)))
                .map(d -> {
                    DoctorPublicDTO dto = new DoctorPublicDTO();
                    dto.setId(d.getUser().getId());
                    dto.setFullName(d.getUser().getFullName());
                    dto.setSpecialization(d.getSpecialization());
                    dto.setHospitalName(d.getHospitalName());
                    dto.setExperienceYears(d.getExperienceYears());
                    dto.setPhotoUrl(buildPhotoUrl(d.getPhotoPath()));
                    dto.setAbout(d.getAbout());
                    dto.setAvailability(d.getAvailability());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
