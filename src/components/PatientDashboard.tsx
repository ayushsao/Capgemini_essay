'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Patient, fetchJessicaTaylorData } from '@/services/patientService';
import Image from 'next/image';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PatientDashboard() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatientData() {
      try {
        const data = await fetchJessicaTaylorData();
        if (!data) {
          setError('Jessica Taylor not found in patient data');
        } else {
          setPatient(data);
        }
      } catch (err) {
        setError('Failed to load patient data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPatientData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error || 'Patient not found'}</p>
        </div>
      </div>
    );
  }

  // Prepare blood pressure chart data
  const chartLabels = patient.diagnosis_history.map((item) => {
    // Safely handle month names
    const monthAbbr = item.month.length >= 3 ? item.month.substring(0, 3) : item.month;
    return `${monthAbbr} ${item.year}`;
  });
  
  const systolicData = patient.diagnosis_history.map(
    (item) => item.blood_pressure.systolic.value
  );
  
  const diastolicData = patient.diagnosis_history.map(
    (item) => item.blood_pressure.diastolic.value
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Systolic',
        data: systolicData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Diastolic',
        data: diastolicData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Blood Pressure History',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'mmHg',
        },
      },
    },
  };

  // Get latest diagnosis (with safety check)
  const latestDiagnosis = patient.diagnosis_history[0];
  
  if (!latestDiagnosis) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-yellow-600">No diagnosis history available for this patient</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-2">Coalition Technologies - Patient Data</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={patient.profile_picture}
                    alt={patient.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium text-gray-900">{patient.gender}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium text-gray-900">{patient.age} years</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-medium text-gray-900">{patient.date_of_birth}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-900">{patient.phone_number}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Emergency:</span>
                  <span className="font-medium text-gray-900">{patient.emergency_contact}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Insurance:</span>
                  <span className="font-medium text-gray-900">{patient.insurance_type}</span>
                </div>
              </div>
            </div>

            {/* Lab Results */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lab Results</h3>
              <div className="space-y-3">
                {patient.lab_results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">{result.name}</span>
                    <span className="font-medium text-gray-900">
                      {result.value} {result.unit || ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Blood Pressure Chart and Vital Signs */}
          <div className="lg:col-span-2">
            {/* Blood Pressure Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Latest Vital Signs */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Latest Vital Signs ({latestDiagnosis.month} {latestDiagnosis.year})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Blood Pressure</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {latestDiagnosis.blood_pressure.systolic.value}/
                        {latestDiagnosis.blood_pressure.diastolic.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">mmHg</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        latestDiagnosis.blood_pressure.systolic.levels === 'Normal' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {latestDiagnosis.blood_pressure.systolic.levels}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Heart Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {latestDiagnosis.heart_rate.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">bpm</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        latestDiagnosis.heart_rate.levels === 'Normal' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {latestDiagnosis.heart_rate.levels}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Respiratory Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {latestDiagnosis.respiratory_rate.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">breaths/min</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        latestDiagnosis.respiratory_rate.levels === 'Normal' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {latestDiagnosis.respiratory_rate.levels}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {latestDiagnosis.temperature.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">°F</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        latestDiagnosis.temperature.levels === 'Normal' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {latestDiagnosis.temperature.levels}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Diagnostic List</h3>
              <div className="space-y-3">
                {patient.diagnostic_list.map((diagnostic, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{diagnostic.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{diagnostic.description}</p>
                      </div>
                      <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full whitespace-nowrap">
                        {diagnostic.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
