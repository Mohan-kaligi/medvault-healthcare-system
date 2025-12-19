package com.medvault.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "permissions")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Doctor doctor;

    @ManyToOne
    private Patient patient;

    @Enumerated(EnumType.STRING)
    private PermissionStatus status = PermissionStatus.PENDING;

    private LocalDateTime requestedAt = LocalDateTime.now();
}
