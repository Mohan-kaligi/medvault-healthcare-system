package com.medvault.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String specialization;
    private int experienceYears;
    private String hospitalName;
    private String licenseNumber;
    private boolean declarationAccepted;

    @Enumerated(EnumType.STRING)
    private DoctorStatus status = DoctorStatus.PENDING;

    // FILE PATHS
    private String degreeCertPath;
    private String registrationCertPath;
    private String experienceCertPath;
    private String idProofPath;
    private String photoPath;

    private String about;

    @Column(columnDefinition = "TEXT")
    private String expertise;

    private String availability;


}
