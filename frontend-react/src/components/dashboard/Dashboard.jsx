import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosinstance';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [formData, setFormData] = useState({ name: '', file: null, framework: 'tensorflow' });
  const [message, setMessage] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('');
  const [inputDataString, setInputDataString] = useState('[5.1, 3.5, 1.4, 0.2]');
  const [predictions, setPredictions] = useState(null);
  const [executeError, setExecuteError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          navigate('/login');
          return;
        }
        await axiosInstance.get('/protected-view');
        const modelsResponse = await axiosInstance.get('/models/');
        setModels(modelsResponse.data);
        setLoading(false);
      } catch (error) {
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const data = new FormData();
    data.append('name', formData.name);
    data.append('file', formData.file);
    data.append('framework', formData.framework);

    try {
      await axiosInstance.post('/models/upload/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('✅ Model uploaded successfully!');
      setFormData({ name: '', file: null, framework: 'tensorflow' });
      const modelsResponse = await axiosInstance.get('/models/');
      setModels(modelsResponse.data);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await axiosInstance.delete(`/models/${id}/`);
        setMessage('🗑️ Model deleted successfully!');
        const modelsResponse = await axiosInstance.get('/models/');
        setModels(modelsResponse.data);
      } catch (error) {
        setMessage(`❌ ${error.response?.data?.detail || error.message}`);
      }
    }
  };

  const handleInputDataChange = (e) => {
    setInputDataString(e.target.value);
  };

  const parseInputData = () => {
    try {
      const parsed = JSON.parse(inputDataString);
      if (!Array.isArray(parsed)) throw new Error('Input data must be an array');
      return parsed;
    } catch (error) {
      throw new Error(`Invalid input data: ${error.message}`);
    }
  };

  const handleExecute = async () => {
    setExecuteError('');
    setPredictions(null);
    try {
      const inputData = parseInputData();
      const response = await axiosInstance.post(`/models/${selectedModel}/execute/`, {
        input_data: inputData,
      });
      setPredictions(response.data.predictions);
    } catch (error) {
      setExecuteError(error.response?.data?.detail || error.message);
    }
  };

  if (loading) return <div className="text-center text-light py-5">Loading dashboard...</div>;

  return (
    <div className="container text-light py-4">
      <h1 className="mb-4 text-center display-5 fw-bold">ML Model Dashboard</h1>

      {/* Upload Form */}
      <div className="bg-light-dark p-4 rounded shadow-sm mb-5">
        <h2 className="mb-3">📤 Upload New Model</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Model Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control bg-dark text-light" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Model File (.h5, .pth, .pkl):</label>
            <input type="file" name="file" onChange={handleChange} accept=".h5,.pth,.pkl" className="form-control bg-dark text-light" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Framework:</label>
            <select name="framework" value={formData.framework} onChange={handleChange} className="form-select bg-dark text-light">
              <option value="tensorflow">TensorFlow</option>
              <option value="pytorch">PyTorch</option>
              <option value="sklearn">Scikit-learn</option>
            </select>
          </div>
          <button type="submit" className="btn btn-info">Upload</button>
        </form>
        {message && <div className="mt-3"><strong>{message}</strong></div>}
      </div>

      {/* Execute Section */}
      <div className="bg-light-dark p-4 rounded shadow-sm mb-5">
        <h2 className="mb-3">🚀 Execute Model</h2>
        <div className="mb-3">
          <label className="form-label">Select Model:</label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="form-select bg-dark text-light">
            <option value="">-- Choose Model --</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.framework})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Input Data (JSON):</label>
          <textarea value={inputDataString} onChange={handleInputDataChange} className="form-control bg-dark text-light" rows="3" />
        </div>
        <button onClick={handleExecute} className="btn btn-success" disabled={!selectedModel}>Execute</button>
        {predictions && (
          <div className="mt-3">
            <h4>📈 Predictions</h4>
            <pre className="bg-dark p-3 rounded">{JSON.stringify(predictions, null, 2)}</pre>
          </div>
        )}
        {executeError && (
          <div className="mt-3 text-danger">
            <strong>❌ Error:</strong> {executeError}
          </div>
        )}
      </div>

      {/* Model Table */}
      <div className="bg-light-dark p-4 rounded shadow-sm">
        <h2 className="mb-3">📚 Your Models</h2>
        {models.length ? (
          <table className="table table-dark table-striped table-hover rounded overflow-hidden">
            <thead>
              <tr>
                <th>Name</th>
                <th>Framework</th>
                <th>Uploaded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id}>
                  <td>{model.name}</td>
                  <td>{model.framework}</td>
                  <td>{new Date(model.uploaded_at).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(model.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No models uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
