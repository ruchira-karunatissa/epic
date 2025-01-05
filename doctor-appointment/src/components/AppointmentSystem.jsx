import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Calendar, Clock, ArrowLeft, HelpCircle, AlertCircle, Check, X, CalendarCheck, CalendarDays, Mic, FileText, Trash2, RefreshCw, ClipboardList } from 'lucide-react';
import { Card, CardContent } from './card';
import { Alert, AlertDescription } from './alert';

// Search Form Component
const SearchForm = ({ onSearch, loading }) => {
  const [formData, setFormData] = useState({
    practitioner: '',
    specialization: '',
    location: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'endDate') {
      if (value.length === 4 && !value.includes('-')) {
        const formattedDate = `${value}-01-01`;
        setFormData(prev => ({
          ...prev,
          [name]: formattedDate
        }));
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="practitioner"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder="Search by practitioner name"
        value={formData.practitioner}
        onChange={handleChange}
      />
      <input
        type="text"
        name="specialization"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder="Search by specialization"
        value={formData.specialization}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder="Search by location"
        value={formData.location}
        onChange={handleChange}
      />
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate}
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? 'Searching...' : (
          <>
            <Search className="mr-2" size={16} />
            Search Appointments
          </>
        )}
      </button>
    </form>
  );
};

// Booking Note Form Component
const BookingNoteForm = ({ onSubmit, loading }) => {
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setNote(prevNote => prevNote + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Failed to recognize speech. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      setSpeechSupported(true);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          setError('Please allow microphone access to use voice input.');
        } else {
          setError('Error starting voice recognition. Please try again.');
        }
      }
    }
  };

  const handleClearText = () => {
    setNote('');
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setError('Appointment note is required');
      return;
    }
    onSubmit(note);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">
            Appointment Note <span className="text-red-600">*</span>
          </label>
          {note && (
            <button
              type="button"
              onClick={handleClearText}
              className="text-sm text-red-600 hover:text-red-700 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear Text
            </button>
          )}
        </div>
        <div className="relative">
          <textarea
            className="w-full p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={3}
            placeholder="Enter your appointment note or use voice input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {speechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-2 bottom-2 p-2 rounded-full ${
                isListening
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600'
              } hover:bg-opacity-80 transition-colors`}
              disabled={loading}
            >
              <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
        {isListening && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <span className="mr-2">●</span>
            <span>Listening... Click the microphone icon to stop.</span>
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        disabled={loading}
      >
        {loading ? 'Confirming...' : 'Confirm Appointment'}
      </button>
    </form>
  );
};

// Booked Appointments Modal Component
const BookedAppointmentsModal = ({ isOpen, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchBookedAppointments();
    }
  }, [isOpen]);

  const fetchBookedAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3007/api/patient/erXuFYUfucBZaryVksYEcMg3/appointments');
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();

      // Sort appointments by date in descending order
      const sortedAppointments = [...(data.appointments || [])].sort((a, b) => {
        const dateA = new Date(a.dateTime.start);
        const dateB = new Date(b.dateTime.start);
        return dateB - dateA;
      });

      setAppointments(sortedAppointments);
    } catch (err) {
      setError(`Error fetching appointments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDateTime = (dateTimeObj) => {
    try {
      const date = new Date(dateTimeObj.start);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch (e) {
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-red-600">Booked Appointments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : appointments.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No booked appointments found.
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const { date, time } = formatDateTime(appointment.dateTime);

                return (
                  <div
                    key={appointment.appointmentId}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={14} className="text-gray-500" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-500" />
                          <span>{time}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{appointment.practitioner.name}</div>
                        <div className="text-sm text-gray-600">{appointment.location.name}</div>
                        <div className="text-sm text-gray-600">{appointment.type}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: {appointment.appointmentId}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Clinical Note Modal Component
const ClinicalNoteModal = ({ isOpen, onClose }) => {
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setNoteText(prevText => prevText + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Failed to recognize speech. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      setSpeechSupported(true);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          setError('Please allow microphone access to use voice input.');
        } else {
          setError('Error starting voice recognition. Please try again.');
        }
      }
    }
  };

  const handleClearText = () => {
    setNoteText('');
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      setError('Clinical note text is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        patientId: "erXuFYUfucBZaryVksYEcMg3",
        encounterId: "eoK8nLRcEypNjtns4dgnF3Q3",
        noteText: noteText.trim()
      };

      const response = await fetch('http://localhost:3008/api/clinical-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setNoteText('');
      } else {
        throw new Error(data.message || 'Failed to create clinical note');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the clinical note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-red-600">Create Clinical Note</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Clinical Note Created!</h3>
              <p className="text-gray-600 mb-4">
                Your clinical note has been successfully saved.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setNoteText('');
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Create Another Note
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">
                      Clinical Note <span className="text-red-600">*</span>
                    </label>
                    {noteText && (
                      <button
                        type="button"
                        onClick={handleClearText}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear Text
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <textarea
                      className="w-full p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={6}
                      placeholder="Click the microphone icon and start speaking, or type your note here"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <div className="absolute right-2 bottom-2 flex space-x-2">
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={toggleListening}
                          className={`p-2 rounded-full ${
                            isListening
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                          } hover:bg-opacity-80 transition-colors`}
                          title={isListening ? "Stop recording" : "Start recording"}
                        >
                          <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  )}
                  {isListening && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <span className="mr-2 animate-pulse">●</span>
                      <span>Listening... Click the microphone icon to stop.</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  {noteText && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleClearText}
                        className="text-gray-600 hover:text-gray-700 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 flex items-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Start Over
                      </button>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Note...' : 'Create Clinical Note'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// View Clinical Notes Modal Component
const ViewClinicalNotesModal = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchClinicalNotes();
    }
  }, [isOpen]);

  const fetchClinicalNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3009/api/patients/erXuFYUfucBZaryVksYEcMg3/clinical-notes');
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (err) {
      setError(`Error fetching clinical notes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-red-600">Clinical Notes History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-8">Loading clinical notes...</div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : notes.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No clinical notes found.
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="border rounded-lg p-4 bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {note.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        By {note.author} • {formatDate(note.date)}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      note.docStatus === 'final'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {note.docStatus.charAt(0).toUpperCase() + note.docStatus.slice(1)}
                    </span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {note.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main AppointmentSystem Component
const AppointmentSystem = () => {
  const [currentStep, setCurrentStep] = useState('search');
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBookedAppointments, setShowBookedAppointments] = useState(false);
  const [showClinicalNote, setShowClinicalNote] = useState(false);
  const [showNotesHistory, setShowNotesHistory] = useState(false);

  const PATIENT_INFO = {
    name: "Camila Maria Lopez",
    id: "erXuFYUfucBZaryVksYEcMg3"
  };

  const handleSearch = async (searchData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = Object.fromEntries(
        Object.entries(searchData).filter(([_, value]) => value)
      );
      const response = await fetch('http://localhost:3003/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments);
        setCurrentStep('times');
      } else {
        throw new Error(data.message || 'Server returned unsuccessful response');
      }
    } catch (err) {
      setError(`Error connecting to server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (note) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        resourceType: "Parameters",
        parameter: [
          {
            name: "patient",
            valueIdentifier: { value: PATIENT_INFO.id }
          },
          {
            name: "appointment",
            valueIdentifier: { value: selectedAppointment.appointmentId }
          },
          {
            name: "appointmentNote",
            valueString: note.trim()
          }
        ]
      };
      const response = await fetch('http://localhost:3004/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      const newAppointmentId = data.details?.entry?.[0]?.resource?.id;

      setBookingResponse({
        ...data,
        appointmentId: newAppointmentId
      });

      if (data.success) {
        setShowSuccess(true);
      } else {
        throw new Error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      setError(`Error booking appointment: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setCurrentStep('form');
    setError(null);
  };

  const handleBack = () => {
    if (currentStep === 'form') setCurrentStep('times');
    else if (currentStep === 'times') {
      setCurrentStep('search');
      setSelectedAppointment(null);
    }
  };

  const handleBookAnother = () => {
    setShowSuccess(false);
    setCurrentStep('search');
    setSelectedAppointment(null);
    setError(null);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const SearchScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-gradient-to-r from-red-600 to-yellow-500 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">15% OFF</h1>
            <p className="text-white mb-4">LIFETIME DISCOUNT ON CHANNELING SERVICE FEE</p>
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium">
              Sign up now
            </button>
          </div>
          <div className="w-24 h-24 relative">
            <div className="absolute right-0 top-0 bg-white rounded-lg p-2">
              <div className="w-16 h-16 relative">
                <div className="font-bold text-1xl text-red-600">Doc990</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-6 mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Welcome back, Camila!</h2>
              <p className="text-sm text-gray-600">
                Schedule your next appointment or manage your existing ones.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Patient ID</p>
              <p className="text-sm font-mono text-gray-600">{PATIENT_INFO.id}</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto mt-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-600">Find Available Appointments</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowClinicalNote(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <FileText size={18} />
                <span>Create Note</span>
              </button>
              <button
                onClick={() => setShowNotesHistory(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <ClipboardList size={18} />
                <span>View Notes</span>
              </button>
              <button
                onClick={() => setShowBookedAppointments(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <CalendarCheck size={18} />
                <span>View Booked</span>
              </button>
            </div>
          </div>
          <SearchForm onSearch={handleSearch} loading={loading} />
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <BookedAppointmentsModal
        isOpen={showBookedAppointments}
        onClose={() => setShowBookedAppointments(false)}
      />

      <ClinicalNoteModal
        isOpen={showClinicalNote}
        onClose={() => setShowClinicalNote(false)}
      />

      <ViewClinicalNotesModal
        isOpen={showNotesHistory}
        onClose={() => setShowNotesHistory(false)}
      />
    </div>
  );

  const AppointmentList = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <button
        onClick={handleBack}
        className="mb-4 flex items-center text-red-600 hover:text-red-700"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back to Search
      </button>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-red-600">Available Appointments</h2>
            <span className="text-sm text-gray-600">Total: {appointments.length}</span>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No appointments found matching your criteria.
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((appointment) => {
                const { date, time } = formatDateTime(appointment.dateTime);
                return (
                  <div
                    key={appointment.appointmentId}
                    className="border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <button
                      className="w-full p-3 text-left"
                      onClick={() => handleTimeSelect(appointment)}
                      disabled={!appointment.isBookable}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-500" />
                            <span className="text-sm">{date}</span>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <Clock size={14} className="text-gray-500" />
                            <span className="text-sm">{time}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{appointment.practitioner}</div>
                          <div className="text-sm text-gray-600">{appointment.location}</div>
                          <div className="text-red-600 text-xs mt-1">MYCHART VIDEO VISIT</div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const BookingForm = () => {
    const { date, time } = formatDateTime(selectedAppointment.dateTime);
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-red-600 hover:text-red-700"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Times
        </button>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <HelpCircle size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-600">{selectedAppointment.practitioner}</h2>
                <p className="text-sm text-gray-600">{selectedAppointment.location}</p>
                <p className="text-sm text-red-600">MYCHART VIDEO VISIT</p>
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{date}</span>
                    <Clock size={14} />
                    <span>{time}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-medium mb-2">Patient Information</h3>
                <p className="text-sm">Name: {PATIENT_INFO.name}</p>
                <p className="text-sm">Patient ID: {PATIENT_INFO.id}</p>
              </div>

              <BookingNoteForm onSubmit={handleConfirmAppointment} loading={loading} />

              {error && !error.includes('note') && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const SuccessPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Appointment Confirmed!</h3>
            <p className="text-gray-600 mb-4">
              Your appointment has been successfully booked.
            </p>
            <div className="bg-gray-50 p-3 rounded w-full mb-4">
              <h4 className="font-medium text-sm mb-2">Appointment Details</h4>
              {bookingResponse?.appointmentId && (
                <div className="text-sm">
                  <span className="font-medium">Appointment ID:</span>
                  <p className="mt-1 font-mono bg-gray-100 p-2 rounded break-all">
                    {bookingResponse.appointmentId}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleBookAnother}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Book Another Appointment
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (showSuccess) return <SuccessPopup />;
  if (currentStep === 'search') return <SearchScreen />;
  if (currentStep === 'times') return <AppointmentList />;
  if (currentStep === 'form' && selectedAppointment) return <BookingForm />;
  return null;
};

export default AppointmentSystem;