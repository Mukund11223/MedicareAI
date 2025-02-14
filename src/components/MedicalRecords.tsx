import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, File, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getAIAnalysis } from '../lib/openai';

interface MedicalRecord {
  id: string;
  record_type: string;
  data: any;
  notes: string;
  created_at: string;
}

interface AIAnalysis {
  summary: string;
  recommendations: string[];
  risk_factors: string[];
}

const MedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data: records, error } = await supabase
      .from('medical_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching records:', error);
      return;
    }

    setRecords(records || []);

    // Fetch AI analysis for each record
    records?.forEach(async (record) => {
      if (!analyses[record.id]) {
        const analysis = await getAIAnalysis(record.data);
        setAnalyses(prev => ({
          ...prev,
          [record.id]: analysis
        }));
      }
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      for (const file of acceptedFiles) {
        // Read file content
        const content = await file.text();
        
        // Create medical record
        const { data: record, error: recordError } = await supabase
          .from('medical_records')
          .insert([
            {
              record_type: file.type,
              data: {
                filename: file.name,
                content,
                type: file.type,
                size: file.size
              },
              notes: `Uploaded on ${new Date().toLocaleDateString()}`
            }
          ])
          .select()
          .single();

        if (recordError) throw recordError;

        // Get AI analysis
        const analysis = await getAIAnalysis({
          filename: file.name,
          content,
          type: file.type
        });

        setAnalyses(prev => ({
          ...prev,
          [record.id]: analysis
        }));

        // Update records list
        setRecords(prev => [record, ...prev]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/*': ['.txt', '.csv'],
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600 mt-2">Securely store and manage your medical documents</p>
      </div>

      {/* Upload Section */}
      <div 
        {...getRootProps()} 
        className={`bg-white p-8 rounded-xl shadow-sm border-2 border-dashed transition-colors cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop your files here' : 'Drag & drop medical files here'}
          </p>
          <p className="text-gray-500 mt-2">or click to select files</p>
          <p className="text-sm text-gray-400 mt-2">Supported formats: PDF, JPEG, PNG, TXT, CSV (max 5MB)</p>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {uploadError}
        </div>
      )}

      {/* Recent Records */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Records</h2>
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="border rounded-lg overflow-hidden">
              <div className="flex items-center space-x-4 p-4 bg-gray-50">
                <FileText className="h-6 w-6 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">{record.data.filename}</p>
                  <p className="text-sm text-gray-600">
                    Uploaded on {new Date(record.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {analyses[record.id] && (
                <div className="p-4 border-t">
                  <h3 className="font-medium text-gray-900 mb-2">AI Analysis</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600">{analyses[record.id].summary}</p>
                    
                    {analyses[record.id].recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Recommendations:</h4>
                        <ul className="list-disc list-inside text-gray-600 pl-4">
                          {analyses[record.id].recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analyses[record.id].risk_factors.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Risk Factors:</h4>
                        <ul className="list-disc list-inside text-gray-600 pl-4">
                          {analyses[record.id].risk_factors.map((risk, index) => (
                            <li key={index}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {records.length === 0 && !isUploading && (
            <div className="text-center text-gray-500 py-8">
              No medical records uploaded yet
            </div>
          )}

          {isUploading && (
            <div className="text-center text-gray-500 py-8">
              Uploading and analyzing your records...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;