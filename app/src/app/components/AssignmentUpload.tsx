// src/components/AssignmentUpload.tsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Props = {
  assignmentId: string; // pass the assignment id as prop
};

export default function AssignmentUpload({ assignmentId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // basic client-side constraints
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
  ];

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const selected = e.target.files && e.target.files[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE) {
      setError('File too large. Max 20 MB allowed.');
      setFile(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('File type not allowed. Use PDF, ZIP, DOC(X), PNG, JPG or TXT.');
      setFile(null);
      return;
    }
    setFile(selected);
  }

  async function submitFile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError('Please select a file to submit.');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    // Additional fields if needed:
    formData.append('assignment_id', assignmentId);

    try {
      // Example: token stored in localStorage under 'authToken'
      const token = localStorage.getItem('authToken');

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          onUploadProgress(progressEvent) {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          },
        }
      );

      // handle response
      if (response.status === 200 || response.status === 201) {
        // Submission successful — you can redirect to a submissions page or show success
        alert('Assignment submitted successfully!');
        navigate(`/user/assignments/${assignmentId}/status`);
      } else {
        setError('Upload failed. Server responded: ' + response.statusText);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || err.message || 'Upload failed');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }

  return (
    <div className="max-w-xl p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Submit Assignment</h2>

      <form onSubmit={submitFile}>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Select file</label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={onFileChange}
            accept=".pdf,.zip,.doc,.docx,.txt,.png,.jpg,.jpeg"
            disabled={loading}
          />
          {file && (
            <div className="mt-2 text-sm">
              Selected: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
            </div>
          )}
        </div>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <div className="mb-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Submit Assignment'}
          </button>
        </div>

        {loading && (
          <div className="mb-2">
            <div className="text-sm mb-1">Progress: {uploadProgress}%</div>
            <progress value={uploadProgress} max={100} style={{ width: '100%' }} />
          </div>
        )}
      </form>
    </div>
  );
}
