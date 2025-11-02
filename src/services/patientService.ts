// Patient data service for Coalition Technologies API
export interface DiagnosisHistory {
  month: string;
  year: number;
  blood_pressure: {
    systolic: {
      value: number;
      levels: string;
    };
    diastolic: {
      value: number;
      levels: string;
    };
  };
  heart_rate: {
    value: number;
    levels: string;
  };
  respiratory_rate: {
    value: number;
    levels: string;
  };
  temperature: {
    value: number;
    levels: string;
  };
}

export interface DiagnosticListItem {
  name: string;
  description: string;
  status: string;
}

export interface LabResult {
  name: string;
  value: string;
  unit?: string;
}

export interface Patient {
  name: string;
  gender: string;
  age: number;
  profile_picture: string;
  date_of_birth: string;
  phone_number: string;
  emergency_contact: string;
  insurance_type: string;
  diagnosis_history: DiagnosisHistory[];
  diagnostic_list: DiagnosticListItem[];
  lab_results: LabResult[];
}

/**
 * Fetches patient data from our API route (which proxies to Coalition Technologies API)
 */
export async function fetchPatientData(): Promise<Patient[]> {
  try {
    const response = await fetch('/api/patient', {
      cache: 'no-store', // Disable caching to always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch patient data: ${response.statusText}`);
    }

    const data: Patient[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error;
  }
}

/**
 * Finds Jessica Taylor in the patient data
 */
export async function fetchJessicaTaylorData(): Promise<Patient | null> {
  const patients = await fetchPatientData();
  const jessicaTaylor = patients.find(patient => patient.name === 'Jessica Taylor');
  return jessicaTaylor || null;
}
