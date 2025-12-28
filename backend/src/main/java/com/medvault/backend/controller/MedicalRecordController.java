package com.medvault.backend.controller;

import com.medvault.backend.model.*;
import com.medvault.backend.repository.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.medvault.backend.service.EmailService;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/records")
@CrossOrigin("*")
public class MedicalRecordController {

    private final MedicalRecordRepository recordRepo;
    private final PatientRepository patientRepo;
    private final AppointmentRepository appointmentRepo;
    private final EmailService emailService;
    public MedicalRecordController(
            MedicalRecordRepository recordRepo,
            PatientRepository patientRepo,
            AppointmentRepository appointmentRepo,
            EmailService emailService
    ) {
        this.recordRepo = recordRepo;
        this.patientRepo = patientRepo;
        this.appointmentRepo = appointmentRepo;
        this.emailService = emailService;
    }

    // ----------------------------------------------------
    // 1️⃣ UPLOAD MEDICAL RECORD
    // ----------------------------------------------------
    @PostMapping("/upload")
    public MedicalRecord uploadRecord(
            @RequestParam Long patientId,
            @RequestParam String title,
            @RequestParam RecordCategory category,
            @RequestParam MultipartFile file
    ) throws Exception {

        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 📁 Physical folder
        String uploadDir = "C:/medvault/uploads/records/" + patientId;
        Files.createDirectories(Paths.get(uploadDir));

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path fullPath = Paths.get(uploadDir, filename);
        file.transferTo(fullPath.toFile());

        // ✅ IMPORTANT: Store RELATIVE PATH (not C:/...)
        String relativePath = "/uploads/records/" + patientId + "/" + filename;

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setTitle(title);
        record.setCategory(category);
        record.setFilePath(relativePath);
        record.setUploadedDate(LocalDate.now());

        return recordRepo.save(record);
    }

    // ----------------------------------------------------
    // 2️⃣ GET ALL RECORDS OF A PATIENT
    // ----------------------------------------------------
    @GetMapping("/patient/{id}")
    public List<MedicalRecord> getPatientRecords(@PathVariable Long id) {
        return recordRepo.findByPatientId(id);
    }

    // ----------------------------------------------------
    // 3️⃣ DELETE RECORD (PATIENT ONLY)
    // ----------------------------------------------------
    @DeleteMapping("/{id}")
    public void deleteRecord(@PathVariable Long id) {
        recordRepo.deleteById(id);
    }
    @PostMapping("/prescription")
    public MedicalRecord uploadPrescription(
            @RequestParam Long appointmentId,
            @RequestParam MultipartFile file
    ) throws Exception {

        Appointment appt = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appt.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Prescription allowed only for confirmed appointments");
        }

        Patient patient = appt.getPatient();

        String uploadDir =
                "C:/medvault/uploads/records/" + patient.getId() + "/prescriptions";
        Files.createDirectories(Paths.get(uploadDir));

        String filename =
                System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path fullPath = Paths.get(uploadDir, filename);
        file.transferTo(fullPath.toFile());

        String relativePath =
                "/uploads/records/" + patient.getId() + "/prescriptions/" + filename;

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setAppointment(appt);
        record.setTitle("Prescription");
        record.setCategory(RecordCategory.PRESCRIPTION);
        record.setFilePath(relativePath);
        record.setUploadedDate(LocalDate.now());

        MedicalRecord saved = recordRepo.save(record);
        recordRepo.flush();
        // ------------------------------------
        // 📧 SEND EMAIL TO PATIENT
        // ------------------------------------
        String siteLink = "http://localhost:3000/patient/records";

        emailService.sendPrescriptionAddedMail(
                patient.getUser().getEmail(),
                patient.getUser().getFullName(),
                appt.getDoctor().getUser().getFullName(),
                appt.getAppointmentDate().toString(),
                appt.getFinalConsultationTime(),
                siteLink
        );

        return saved;
    }

    @GetMapping("/appointment/{id}")
    public List<MedicalRecord> getByAppointment(@PathVariable Long id) {
        return recordRepo.findByAppointment_Id(id);
    }


}
