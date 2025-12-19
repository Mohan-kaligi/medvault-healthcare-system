package com.medvault.backend.repository;

import com.medvault.backend.model.Permission;
import com.medvault.backend.model.PermissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findByPatientId(Long patientId);
    List<Permission> findByDoctorId(Long doctorId);
}
