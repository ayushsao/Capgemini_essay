import { NextResponse } from 'next/server';

const API_URL = process.env.COALITION_API_URL || 'https://fedskillstest.coalitiontechnologies.workers.dev';
const API_USERNAME = process.env.COALITION_API_USERNAME || 'coalition';
const API_PASSWORD = process.env.COALITION_API_PASSWORD || 'skills-test';
const API_TIMEOUT = parseInt(process.env.COALITION_API_TIMEOUT || '5000', 10);

// Mock data for Jessica Taylor (fallback when API is unavailable)
const mockPatientData = [
  {
    name: 'Jessica Taylor',
    gender: 'Female',
    age: 28,
    profile_picture: 'https://ui-avatars.com/api/?name=Jessica+Taylor&size=256&background=0D8ABC&color=fff',
    date_of_birth: '1996-08-23',
    phone_number: '(415) 555-1234',
    emergency_contact: '(415) 555-5678',
    insurance_type: 'Sunrise Health Assurance',
    diagnosis_history: [
      {
        month: 'March',
        year: 2024,
        blood_pressure: {
          systolic: { value: 160, levels: 'Higher than Average' },
          diastolic: { value: 78, levels: 'Normal' }
        },
        heart_rate: { value: 78, levels: 'Normal' },
        respiratory_rate: { value: 20, levels: 'Normal' },
        temperature: { value: 98.6, levels: 'Normal' }
      },
      {
        month: 'February',
        year: 2024,
        blood_pressure: {
          systolic: { value: 155, levels: 'Higher than Average' },
          diastolic: { value: 76, levels: 'Normal' }
        },
        heart_rate: { value: 76, levels: 'Normal' },
        respiratory_rate: { value: 19, levels: 'Normal' },
        temperature: { value: 98.4, levels: 'Normal' }
      },
      {
        month: 'January',
        year: 2024,
        blood_pressure: {
          systolic: { value: 150, levels: 'Higher than Average' },
          diastolic: { value: 75, levels: 'Normal' }
        },
        heart_rate: { value: 74, levels: 'Normal' },
        respiratory_rate: { value: 18, levels: 'Normal' },
        temperature: { value: 98.5, levels: 'Normal' }
      },
      {
        month: 'December',
        year: 2023,
        blood_pressure: {
          systolic: { value: 148, levels: 'Higher than Average' },
          diastolic: { value: 74, levels: 'Normal' }
        },
        heart_rate: { value: 72, levels: 'Normal' },
        respiratory_rate: { value: 18, levels: 'Normal' },
        temperature: { value: 98.3, levels: 'Normal' }
      },
      {
        month: 'November',
        year: 2023,
        blood_pressure: {
          systolic: { value: 145, levels: 'Higher than Average' },
          diastolic: { value: 73, levels: 'Normal' }
        },
        heart_rate: { value: 70, levels: 'Normal' },
        respiratory_rate: { value: 17, levels: 'Normal' },
        temperature: { value: 98.2, levels: 'Normal' }
      },
      {
        month: 'October',
        year: 2023,
        blood_pressure: {
          systolic: { value: 142, levels: 'Normal' },
          diastolic: { value: 72, levels: 'Normal' }
        },
        heart_rate: { value: 68, levels: 'Normal' },
        respiratory_rate: { value: 17, levels: 'Normal' },
        temperature: { value: 98.1, levels: 'Normal' }
      }
    ],
    diagnostic_list: [
      {
        name: 'Hypertension',
        description: 'Chronic high blood pressure',
        status: 'Under Observation'
      },
      {
        name: 'Type 2 Diabetes',
        description: 'Insulin resistance and elevated blood sugar',
        status: 'Cured'
      },
      {
        name: 'Asthma',
        description: 'Respiratory condition causing breathing difficulties',
        status: 'Inactive'
      },
      {
        name: 'Seasonal Allergies',
        description: 'Allergic rhinitis triggered by pollen',
        status: 'Active'
      }
    ],
    lab_results: [
      { name: 'Blood Glucose', value: '95', unit: 'mg/dL' },
      { name: 'Total Cholesterol', value: '185', unit: 'mg/dL' },
      { name: 'HDL Cholesterol', value: '55', unit: 'mg/dL' },
      { name: 'LDL Cholesterol', value: '110', unit: 'mg/dL' },
      { name: 'Triglycerides', value: '100', unit: 'mg/dL' },
      { name: 'Hemoglobin A1C', value: '5.5', unit: '%' }
    ]
  }
];

export async function GET() {
  try {
    // Try to fetch from the actual API first
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64'),
      },
      cache: 'no-store',
      // Add timeout
      signal: AbortSignal.timeout(API_TIMEOUT),
    });

    if (!response.ok) {
      console.log('API returned non-OK status, using mock data');
      return NextResponse.json(mockPatientData);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log('API unavailable, using mock data:', error instanceof Error ? error.message : 'Unknown error');
    // Return mock data when API is unavailable
    return NextResponse.json(mockPatientData);
  }
}
