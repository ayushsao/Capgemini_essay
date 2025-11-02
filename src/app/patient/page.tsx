import PatientDashboard from '@/components/PatientDashboard';

export const metadata = {
  title: 'Patient Dashboard - Jessica Taylor | Coalition Technologies',
  description: 'Patient health dashboard displaying vital signs, diagnosis history, and lab results for Jessica Taylor',
};

export default function PatientPage() {
  return <PatientDashboard />;
}
