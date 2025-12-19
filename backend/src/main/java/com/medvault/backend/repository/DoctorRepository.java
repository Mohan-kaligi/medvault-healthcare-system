package com.medvault.backend.repository;

import com.medvault.backend.model.Doctor;
import com.medvault.backend.model.DoctorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByStatus(DoctorStatus status);
}
