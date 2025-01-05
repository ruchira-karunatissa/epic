# Epic Healthcare Appointment System - API Documentation

## Table of Contents
1. [Authentication](#1-authentication)
2. [Appointment Management](#2-appointment-management)
3. [Clinical Notes](#3-clinical-notes)
4. [Health Checks](#4-health-checks)
5. [Error Handling](#5-error-handling)

## 1. Authentication

### Generate Epic Access Token
Generates an OAuth 2.0 access token for Epic FHIR API access using JWT client credentials.

**Endpoint:** `POST /api/token`  
**Port:** 3001

**Epic Backend API:** `POST https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token`

**JWT Claims:**
```json
{
  "iss": "<sandboxClientID>",
  "sub": "<sandboxClientID>",
  "aud": "<oauth2TokenUrl>",
  "jti": "<uuid>",
  "exp": "<timestamp + 60>"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": number
}
```

## 2. Appointment Management

### Search Available Appointments
Search and filter available appointments.

**Endpoint:** `POST /api/appointments`  
**Port:** 3003

**Epic Backend API:** `POST https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/STU3/Appointment/$find`

**Request Body:**
```json
{
  "practitioner": "string",
  "specialization": "string",
  "location": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

**Response:**
```json
{
  "success": true,
  "totalCount": number,
  "appointments": [
    {
      "appointmentId": "string",
      "status": "string",
      "patientId": "string",
      "practitioner": "string",
      "location": "string",
      "specialization": "string",
      "dateTime": "string",
      "duration": "number | string",
      "isBookable": boolean
    }
  ]
}
```

### Book Appointment
Book a specific appointment slot.

**Endpoint:** `POST /api/book-appointment`  
**Port:** 3004

**Epic Backend API:** `POST https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/STU3/Appointment/$book`

**Request Body:**
```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "patient",
      "valueIdentifier": {
        "value": "string"
      }
    },
    {
      "name": "appointment",
      "valueIdentifier": {
        "value": "string"
      }
    },
    {
      "name": "appointmentNote",
      "valueString": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "appointmentId": "string",
  "message": "Appointment successfully booked",
  "details": object,
  "timestamp": "string"
}
```

### Get Patient's Booked Appointments
Retrieve all appointments for a specific patient.

**Endpoint:** `GET /api/patient/:patientId/appointments`  
**Port:** 3007

**Epic Backend API:** `GET https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Appointment`

**Query Parameters:**
- `patient`: string
- `service-category`: "appointment"

**Response:**
```json
{
  "success": true,
  "patientId": "string",
  "totalAppointments": number,
  "appointments": [
    {
      "appointmentId": "string",
      "status": "string",
      "type": "string",
      "patient": {
        "name": "string",
        "id": "string"
      },
      "practitioner": {
        "name": "string",
        "id": "string"
      },
      "location": {
        "name": "string",
        "id": "string"
      },
      "dateTime": {
        "start": "string",
        "end": "string"
      },
      "duration": number,
      "created": "string",
      "comment": "string",
      "instructions": "string"
    }
  ]
}
```

## 3. Clinical Notes

### Create Clinical Note
Create a new clinical note for a patient.

**Endpoint:** `POST /api/clinical-notes`  
**Port:** 3008

**Epic Backend API:** `POST https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/DocumentReference`

**Request Body:**
```json
{
  "patientId": "string",
  "encounterId": "string",
  "noteText": "string",
  "noteType": "string", // Optional
  "noteStatus": "string" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Clinical note created successfully",
  "documentReference": {
    "id": "string",
    "status": "string",
    "created": "string",
    "type": "string",
    "patientId": "string",
    "encounterId": "string"
  }
}
```

### Get Clinical Note
Retrieve a specific clinical note by ID.

**Endpoint:** `GET /api/clinical-notes/:documentId`  
**Port:** 3008

**Epic Backend API:** `GET https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/DocumentReference/{documentId}`

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "string",
    "status": "string",
    "type": "string",
    "patientId": "string",
    "encounterId": "string",
    "note": "string"
  }
}
```

### Get Patient's Clinical Notes
Retrieve all clinical notes for a patient.

**Endpoint:** `GET /api/patients/:patientId/clinical-notes`  
**Port:** 3009

**Epic Backend API:** `GET https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/DocumentReference`

**Query Parameters:**
- `patient`: string
- `category`: "clinical-note"

**Response:**
```json
{
  "success": true,
  "totalCount": number,
  "notes": [
    {
      "id": "string",
      "type": "string",
      "status": "string",
      "docStatus": "string",
      "category": "string",
      "subject": "string",
      "content": "string",
      "encounter": "string",
      "date": "string",
      "author": "string",
      "created": "string",
      "binaryId": "string"
    }
  ]
}
```

## 4. Health Checks
Each service provides a health check endpoint.

**Endpoint:** `GET /health`  
**Available on all service ports**

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "string" // ISO timestamp
}
```

## 5. Error Handling

### Common Error Response Formats

**400 Bad Request:**
```json
{
  "success": false,
  "error": "string",
  "details": "string",
  "timestamp": "string"
}
```

**401 Unauthorized:**
```json
{
  "error": true,
  "message": "string",
  "details": "object | null"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "string",
  "details": "string",
  "timestamp": "string"
}
```

## Service Configuration

### CORS Configuration
All services support the following CORS configuration:
```javascript
{
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}
```

### Service Ports
- Authentication Service: 3001
- Appointment Search Service: 3003
- Appointment Booking Service: 3004
- Patient Appointments Service: 3007
- Clinical Notes Creation Service: 3008
- Clinical Notes Search Service: 3009

### Environment Variables
```bash
PORT=<service_port>
EPIC_BASE_URL=https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4
TOKEN_URL=http://localhost:3001/api/token
```
