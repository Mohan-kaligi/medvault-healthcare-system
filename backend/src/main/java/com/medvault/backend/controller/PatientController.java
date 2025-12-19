package com.medvault.backend.controller;

import com.medvault.backend.model.Patient;
import com.medvault.backend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin("*")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping("/{id}")
    public Map<String, Object> getPatientProfile(@PathVariable Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // ✔ Calculate age
        int age = Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears();

        // ✔ Build JSON response manually
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", patient.getId());
        profile.put("fullName", patient.getUser().getFullName());
        profile.put("email", patient.getUser().getEmail());
        profile.put("phone", patient.getUser().getPhone());

        profile.put("age", age);
        profile.put("gender", patient.getGender());
        profile.put("bloodGroup", patient.getBloodGroup());
        profile.put("dob", patient.getDateOfBirth()); // optional

        return profile;
    }
}
