import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPrediction(null); // Clear previous prediction
    setError(null); // Clear previous error
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post(`${API_URL}/api/disease/predict/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error detecting disease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Plant Disease Detection</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || loading}>
        {loading ? 'Detecting...' : 'Upload and Detect'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {prediction && (
        <div>
          <h3>Detection Results:</h3>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
          {/* You will likely want to format this output nicely */}
        </div>
      )}
    </div>
  );
}

export default DiseaseDetection; 