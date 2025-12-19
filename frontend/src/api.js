const API_BASE = "http://localhost:8080/api";

export async function patientRegister(data) {
  return fetch(`${API_BASE}/auth/patient/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

export async function doctorRegister(data) {
  return fetch(`${API_BASE}/auth/doctor/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

export async function login(data) {
  return fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());
}
