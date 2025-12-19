package com.medvault.backend.controller;

import com.medvault.backend.model.*;
import com.medvault.backend.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin("*")
public class AppointmentController {

    private final AppointmentRepository appointmentRepo;
    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;

    public AppointmentController(AppointmentRepository appointmentRepo,
                                 PatientRepository patientRepo,
                                 DoctorRepository doctorRepo) {
        this.appointmentRepo = appointmentRepo;
        this.patientRepo = patientRepo;
        this.doctorRepo = doctorRepo;
    }

    // -----------------------------------------------------
    // 0️⃣ Extra endpoint to fix frontend: /by-id/{id}
    // -----------------------------------------------------
    @GetMapping("/by-id/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    // Original /{id} endpoint
    @GetMapping("/{id}")
    public Appointment getById(@PathVariable Long id) {
        return appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    // -----------------------------------------------------
    // 1️⃣ PATIENT BOOKS APPOINTMENT
    // -----------------------------------------------------
    @PostMapping("/book")
    public Appointment bookAppointment(@RequestBody Appointment a) {

        Long patientId = a.getPatient().getId();
        Long doctorId = a.getDoctor().getId();

        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Prevent duplicate pending appointments
        if (appointmentRepo.existsByPatient_IdAndDoctor_IdAndStatus(
                patientId, doctorId, AppointmentStatus.PENDING)) {
            throw new RuntimeException("You already requested an appointment with this doctor.");
        }

        a.setPatient(patient);
        a.setDoctor(doctor);
        a.setStatus(AppointmentStatus.PENDING);
        a.setAccessStatus(RecordAccessStatus.REQUESTED);
        a.setFinalConsultationTime(null);

        return appointmentRepo.save(a);
    }

    // -----------------------------------------------------
    // 2️⃣ DOCTOR RESPONDS (ACCEPT or REJECT)
    // -----------------------------------------------------
    @PostMapping("/{id}/doctor-response")
    public Appointment doctorResponse(@PathVariable Long id,
                                      @RequestBody Map<String, String> body) {

        Appointment a = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        String action = body.get("action");
        String time = body.get("time");

        if ("ACCEPT".equalsIgnoreCase(action)) {

            if (time == null || time.isBlank()) {
                throw new RuntimeException("Please provide a consultation time.");
            }

            a.setFinalConsultationTime(time.trim());
            a.setStatus(AppointmentStatus.AWAITING_PATIENT_CONFIRMATION);
            a.setAccessStatus(RecordAccessStatus.REQUESTED);
        }
        else if ("REJECT".equalsIgnoreCase(action)) {
            a.setStatus(AppointmentStatus.CANCELLED);
            a.setAccessStatus(RecordAccessStatus.DENIED);
        }

        return appointmentRepo.save(a);
    }

    // -----------------------------------------------------
    // 3️⃣ PATIENT CONFIRMS THE APPOINTMENT
    // -----------------------------------------------------
    @PostMapping("/{id}/patient-confirm")
    public Appointment patientConfirm(@PathVariable Long id,
                                      @RequestBody Map<String, String> body) {

        Appointment a = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        String action = body.get("action");

        if ("CONFIRM".equalsIgnoreCase(action)) {
            a.setStatus(AppointmentStatus.CONFIRMED);
            a.setAccessStatus(RecordAccessStatus.GRANTED);
        }
        else if ("DENY".equalsIgnoreCase(action)) {
            a.setStatus(AppointmentStatus.CANCELLED);
            a.setAccessStatus(RecordAccessStatus.DENIED);
        }

        return appointmentRepo.save(a);
    }

    // -----------------------------------------------------
    // 4️⃣ DOCTOR MARKS APPOINTMENT AS COMPLETED
    // -----------------------------------------------------
    @PostMapping("/{id}/complete")
    public Appointment completeAppointment(@PathVariable Long id) {

        Appointment a = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (a.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed appointments can be completed.");
        }

        a.setStatus(AppointmentStatus.COMPLETED);
        return appointmentRepo.save(a);
    }

    // -----------------------------------------------------
    // 5️⃣ PATIENT SUBMITS FEEDBACK
    // -----------------------------------------------------
    @PostMapping("/{id}/feedback")
    public Appointment submitFeedback(@PathVariable Long id,
                                      @RequestBody Map<String, Object> body) {

        Appointment a = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        String feedback = (String) body.get("feedback");

        Integer rating = body.get("rating") != null
                ? Integer.valueOf(body.get("rating").toString())
                : null;

        a.setFeedbackText(feedback);
        a.setRating(rating);

        return appointmentRepo.save(a);
    }

    // -----------------------------------------------------
    // 6️⃣ GET ALL PATIENT APPOINTMENTS
    // -----------------------------------------------------
    @GetMapping("/patient/{id}")
    public List<Appointment> getPatientAppointments(@PathVariable Long id) {
        return appointmentRepo.findByPatient_Id(id);
    }

    // -----------------------------------------------------
    // 7️⃣ GET ALL DOCTOR APPOINTMENTS
    // -----------------------------------------------------
    @GetMapping("/doctor/{id}")
    public List<Appointment> getDoctorAppointments(@PathVariable Long id) {
        return appointmentRepo.findByDoctor_Id(id);
    }
    // 8️⃣ PATIENT APPROVES OR DENIES MEDICAL RECORD ACCESS
    @PostMapping("/{id}/access")
    public Appointment handleAccess(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        Appointment a = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        String action = body.get("action");

        if ("APPROVE".equalsIgnoreCase(action)) {
            a.setAccessStatus(RecordAccessStatus.GRANTED);
        } else if ("DENY".equalsIgnoreCase(action)) {
            a.setAccessStatus(RecordAccessStatus.DENIED);
        } else {
            throw new RuntimeException("Invalid access action");
        }

        return appointmentRepo.save(a);
    }

}
