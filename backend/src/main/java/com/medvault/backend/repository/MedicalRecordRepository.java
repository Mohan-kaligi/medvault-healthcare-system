package com.medvault.backend.repository;

import com.medvault.backend.model.MedicalRecord;
import com.medvault.backend.model.RecordCategory; // ✅ ADD THIS
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalRecordRepository
        extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByPatientId(Long patientId);

    List<MedicalRecord> findByAppointment_Id(Long appointmentId);

    boolean existsByAppointment_IdAndCategory(
            Long appointmentId,
            RecordCategory category
    );
}
