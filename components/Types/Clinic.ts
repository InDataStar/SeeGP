export type Hours = {
  [day: string]: 
    | { opening: string; closing: string }  // open days
    | "Closed";                             // closed days
};

export const HOURS_OPTIONS = [
  'Open 24 hours',
  '8:00am - 11:00pm',
  '8:00am - 2:00pm',
  '8:00am - 5:00pm',
  '8:00am - 6:00pm',
  '8:00am - 8:00pm',
  '8:30am - 5:00pm',
  '8:30am - 5:30pm',
  '8:30am - 6:00pm',
  '8:30am - 7:00pm',
  '9:00am - 1:00pm',
  '9:00am - 4:00pm',
  '9:00am - 5:00pm',
];

export type Clinic = {
  url: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  open_status: string;
  phone: string;
  amenities?: string[];  // optional, list of amenities
  about?: string[];      // optional, paragraphs about clinic
  hours?: Hours;         // optional, opening hours by day
  busy?:number;
};

// Enum for Clinic Features
export enum ClinicFeature {
  Hours24 = '24 Hours',
  ACCAccredited = 'ACC Accredited',
  ACCProvider = 'ACC Provider',
  Accessible = 'Accessible',
  AccidentInjuryTreatment = 'Accident and injury treatment',
  Appointment = 'Appointment',
  AppointmentOnly = 'Appointment Only',
  Dental = 'Dental',
  FemaleDoctor = 'Female Doctor',
  FluVaccine = 'Flu Vaccine',
  GPServices = 'GP Services',
  OpenWeekends = 'Open Weekends',
  Parking = 'Parking',
  Pharmacy = 'Pharmacy',
  Physio = 'Physio',
  UrgentCare = 'Urgent care',
  WalkIn = 'Walk In',
  Xray = 'X-ray',
}

// Array of all enum values
export const ClinicFeatureList: string[] = Object.values(ClinicFeature);
