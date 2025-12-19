package com.medvault.backend.repository;

import com.medvault.backend.model.DoctorDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorDocumentRepository extends JpaRepository<DoctorDocument, Long> {
    List<DoctorDocument> findByDoctorId(Long doctorId);
}
