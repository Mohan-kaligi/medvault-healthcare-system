package com.medvault.backend.dto;

import lombok.Data;

@Data
public class DoctorDashboardDTO {

    private Long id;

    // From User
    private String fullName;
    private String email;
    private String phone;

    // From Doctor
    private String specialization;
    private String hospitalName;
    private Integer experienceYears;
    private String licenseNumber;
    private String photoUrl;

    // NEW FIELDS (needed for profile settings)
    private String about;
    private String expertise;
    private String availability;

    // Stats
    private long totalPatients;
    private long todaysAppointments;
    private long pendingAppointments;
}
