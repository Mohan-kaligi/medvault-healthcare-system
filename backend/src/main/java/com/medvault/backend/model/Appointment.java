package com.medvault.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // PATIENT
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // DOCTOR
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // Booking details
    private LocalDate appointmentDate;
    private String appointmentTime; // e.g. "10:00 AM - 10:30 AM"


    @Enumerated(EnumType.STRING)
    private AppointmentMode mode;

    private String reason;

    // Status of appointment
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    // Access to patient’s medical records
    @Enumerated(EnumType.STRING)
    private RecordAccessStatus accessStatus = RecordAccessStatus.REQUESTED;
    private String finalConsultationTime;


    private String feedbackText;

    private Integer rating;
}
