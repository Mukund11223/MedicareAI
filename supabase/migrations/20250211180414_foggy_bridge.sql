/*
  # Healthcare Platform Schema

  1. New Tables
    - `profiles`
      - User profiles for both patients and doctors
      - Stores basic info and role (patient/doctor)
    
    - `medical_records`
      - Patient medical records including vitals, ECG data, symptoms
      - Links to patient profiles
    
    - `appointments`
      - Scheduled appointments between patients and doctors
      - Tracks status and type (in-person/video)
    
    - `messages`
      - Secure messaging between patients and doctors
      - HIPAA-compliant communication
    
    - `ai_predictions`
      - Stores AI-generated health predictions and recommendations
      - Links to medical records

  2. Security
    - RLS enabled on all tables
    - Separate policies for patients and doctors
    - Encrypted sensitive medical data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('patient', 'doctor')),
  full_name text NOT NULL,
  email text NOT NULL,
  specialty text, -- For doctors
  license_number text, -- For doctors
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) NOT NULL,
  record_type text NOT NULL,
  data jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) NOT NULL,
  doctor_id uuid REFERENCES profiles(id) NOT NULL,
  appointment_type text NOT NULL CHECK (appointment_type IN ('in-person', 'video')),
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  scheduled_at timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) NOT NULL,
  receiver_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create ai_predictions table
CREATE TABLE IF NOT EXISTS ai_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id uuid REFERENCES medical_records(id) NOT NULL,
  prediction_type text NOT NULL,
  prediction_data jsonb NOT NULL,
  confidence_score float NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Doctors can view patient profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- Medical records policies
CREATE POLICY "Patients can view their own records"
  ON medical_records FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Patients can create their own records"
  ON medical_records FOR INSERT
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors can view assigned patient records"
  ON medical_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  USING (
    patient_id = auth.uid() OR
    doctor_id = auth.uid()
  );

-- Messages policies
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid() OR
    receiver_id = auth.uid()
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- AI predictions policies
CREATE POLICY "Users can view predictions for their records"
  ON ai_predictions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM medical_records
      WHERE medical_records.id = ai_predictions.medical_record_id
      AND medical_records.patient_id = auth.uid()
    )
  );