package com.medvault.backend.repository;

import com.medvault.backend.model.Appointment;
import com.medvault.backend.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatient_Id(Long patientId);

    List<Appointment> findByDoctor_Id(Long doctorId);
    List<Appointment> findByDoctor_IdAndStatus(Long doctorId, AppointmentStatus status);

    // 👇 ADD THIS METHOD (fixes your error)
    boolean existsByPatient_IdAndDoctor_IdAndStatus(Long patientId, Long doctorId, AppointmentStatus status);
}
