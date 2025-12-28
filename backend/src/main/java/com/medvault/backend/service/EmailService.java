package com.medvault.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ------------------------------
    // Patient Email
    // ------------------------------
    public void sendPatientAppointmentConfirmation(
            String to,
            String patientName,
            String doctorName,
            String doctorEmail,
            String doctorPhone,
            String date,
            String time
    ) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(to);
        mail.setSubject("Appointment Confirmed | MedVault");

        mail.setText(
                "Dear " + patientName + ",\n\n" +
                        "Your appointment has been confirmed.\n\n" +
                        "Doctor Details:\n" +
                        "Name: " + doctorName + "\n" +
                        "Email: " + doctorEmail + "\n" +
                        "Phone: " + doctorPhone + "\n\n" +
                        "Appointment Details:\n" +
                        "Date: " + date + "\n" +
                        "Time: " + time + "\n\n" +
                        "Please be available on time.\n\n" +
                        "Regards,\nMedVault Team"
        );

        mailSender.send(mail);
    }

    // ------------------------------
    // Doctor Email
    // ------------------------------
    public void sendDoctorAccessGranted(
            String to,
            String doctorName,
            String patientName,
            String date,
            String time
    ) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(to);
        mail.setSubject("Patient Approved Appointment | MedVault");

        mail.setText(
                "Dear Dr. " + doctorName + ",\n\n" +
                        "The patient has approved the appointment and granted access to medical records.\n\n" +
                        "Patient Name: " + patientName + "\n" +
                        "Date: " + date + "\n" +
                        "Time: " + time + "\n\n" +
                        "You may now review the patient's medical records.\n\n" +
                        "Regards,\nMedVault Team"
        );

        mailSender.send(mail);
    }
    public void sendPrescriptionAddedMail(
            String to,
            String patientName,
            String doctorName,
            String appointmentDate,
            String time,
            String recordLink
    ) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(to);
        mail.setSubject("New Prescription Added | MedVault");

        mail.setText(
                "Dear " + patientName + ",\n\n" +
                        "Your doctor has added a new prescription for your appointment.\n\n" +
                        "Doctor: Dr. " + doctorName + "\n" +
                        "Date: " + appointmentDate + "\n" +
                        "Time: " + time + "\n\n" +
                        "You can view and download your prescription here:\n" +
                        recordLink + "\n\n" +
                        "Regards,\nMedVault Team"
        );

        mailSender.send(mail);
    }

}
