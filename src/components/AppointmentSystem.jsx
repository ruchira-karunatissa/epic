/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Search, Calendar, Clock, ArrowLeft, HelpCircle, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';


// Sample data
const specializations = [
  "Gastroenterological Surgeon",
  "Cardiologist",
  "Pediatrician",
  "Dermatologist"
];

const hospitals = [
  "Lanka Hospitals - Colombo 05",
  "Asiri Hospital",
  "Nawaloka Hospital",
  "Durdans Hospital"
];

const DoctorSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    doctor: '',
    hospital: '',
    specialization: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulating API call
      setTimeout(() => {
        onSearch({
          id: 1,
          name: "Prof. KEMAL I DEEN",
          specialization: "Gastroenterological Surgeon",
          hospital: "Lanka Hospitals - Colombo 05",
          opdNote: "OPD 04 - PLEASE BE INFORMED THAT ONCE YOU CONFIRM THE APPOINTMENTS FOR A PARTICULAR DAY AND TIME,IT CANNOT BE (REFUNDED OR CANCELED)"
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-red-600 to-yellow-500 p-6 text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">15% OFF</h1>
            <p className="text-xl mb-4">LIFETIME DISCOUNT ON CHANNELING SERVICE FEE</p>
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-medium">
              Sign up now
            </button>
          </div>
          <div className="w-32">
            <img src="/api/placeholder/128/128" alt="Doc990 Logo" className="w-full" />
          </div>
        </div>
      </div>

      {/* Search Form */}
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-6">Channel Your Doctor</h2>
          {error && (
            <Alert className="mb-4 bg-red-50 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Doctor Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Doctor - Max 20 Characters"
                maxLength={20}
                onChange={(e) => setSearchParams({...searchParams, doctor: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hospital</label>
              <select 
                className="w-full p-2 border rounded"
                onChange={(e) => setSearchParams({...searchParams, hospital: e.target.value})}
              >
                <option value="">Any Hospital</option>
                {hospitals.map(hospital => (
                  <option key={hospital} value={hospital}>{hospital}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <select 
                className="w-full p-2 border rounded"
                onChange={(e) => setSearchParams({...searchParams, specialization: e.target.value})}
              >
                <option value="">Any Specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
              />
            </div>
            <button
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 flex items-center justify-center"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="mr-2" size={18} />
                  Search
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Service Icons */}
      <div className="max-w-6xl mx-auto mt-8 px-4 mb-8">
        <div className="grid grid-cols-7 gap-4">
          {[
            { icon: "🛒", label: "Health Mart", new: true },
            { icon: "📋", label: "Lab Reports" },
            { icon: "📞", label: "Audio/Video" },
            { icon: "💊", label: "Medicine" },
            { icon: "👨‍⚕️", label: "Doctor Near Me" },
            { icon: "🔍", label: "Check Number" },
            { icon: "✈️", label: "Visa Medical" }
          ].map((service, index) => (
            <Card key={index} className="p-3 text-center hover:shadow-lg cursor-pointer relative">
              {service.new && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className="text-xs font-medium">{service.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const AppointmentForm = ({ doctor, onBack }) => {
  const [formData, setFormData] = useState({
    country: 'Sri Lanka',
    title: 'Mr.',
    phone: '+94',
    idType: 'NIC',
    nic: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.nic) newErrors.nic = 'NIC is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (error) {
      setErrors({ submit: 'Booking failed. Please try again.' });
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-2xl mx-auto mt-8">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Appointment Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your appointment has been successfully booked.</p>
            <button
              onClick={onBack}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
            >
              Book Another Appointment
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center text-red-600 hover:text-red-700"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back to Search
      </button>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <HelpCircle size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-600">{doctor.name}</h2>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-600">{doctor.hospital}</p>
              <p className="text-sm text-red-600 mt-2">{doctor.opdNote}</p>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <div className="flex items-center gap-4">
              <Calendar size={18} />
              <span>December 24, 2024</span>
              <Clock size={18} />
              <span>03:00 PM - 03:15 PM</span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Country', value: formData.country, disabled: true },
              { label: 'Title', value: formData.title, disabled: true },
              { label: 'Phone', value: formData.phone, disabled: true },
              { label: 'NIC', required: true, placeholder: 'NIC - Required', error: errors.nic },
              { label: 'Email', placeholder: 'E-Mail - Optional' },
              { label: 'Address', placeholder: 'Note/Address - Optional' }
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                  {field.required && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded ${field.error ? 'border-red-500' : ''}`}
                  placeholder={field.placeholder}
                  value={field.value}
                  disabled={field.disabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    [field.label.toLowerCase()]: e.target.value
                  })}
                />
                {field.error && (
                  <p className="text-red-500 text-sm mt-1">{field.error}</p>
                )}
              </div>
            ))}

            <button
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 flex items-center justify-center"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AppointmentSystem = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSearch = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBack = () => {
    setSelectedDoctor(null);
  };

  return (
    <div>
      {selectedDoctor ? (
        <AppointmentForm doctor={selectedDoctor} onBack={handleBack} />
      ) : (
        <DoctorSearch onSearch={handleSearch} />
      )}
    </div>
  );
};

export default AppointmentSystem;
