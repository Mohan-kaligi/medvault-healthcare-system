// src/main/java/com/medvault/backend/dto/DoctorPublicDTO.java
package com.medvault.backend.dto;

import lombok.Data;

@Data
public class DoctorPublicDTO {

    private Long id;
    private String fullName;
    private String specialization;
    private String hospitalName;
    private Integer experienceYears;
    private String photoUrl;

    // Short info for cards
    private String about;
    private String availability;
}
