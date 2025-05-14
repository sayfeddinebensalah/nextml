import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosinstance';
import { useNavigate } from 'react-router-dom';

const ModelHub = () => {
  const [formData, setFormData] = useState({ name: '', file: null, framework: 'tensorflow' });
  const [message, setMessage] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('');
  const [inputFile, setInputFile] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [executeError, setExecuteError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return navigate('/login');

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
    if (!window.confirm('Delete this model?')) return;

    try {
      await axiosInstance.delete(`/models/${id}/`);
      setMessage('🗑️ Model deleted successfully!');
      const modelsResponse = await axiosInstance.get('/models/');
      setModels(modelsResponse.data);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleExecute = async () => {
    setExecuteError('');
    setPredictions(null);
    if (!selectedModel || !inputFile) {
      setExecuteError('Please select a model and upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('model_id', selectedModel);
    formData.append('input_data', inputFile);

    try {
      const response = await axiosInstance.post(`/models/execute/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPredictions(response.data.predictions);
    } catch (error) {
      setExecuteError(error.response?.data?.detail || error.message);
    }
  };

  if (loading) return <div className="text-center py-5 fs-4 text-light">⏳ Loading Model Hub...</div>;

  return (
    <div className="container py-4 text-light">
      <h2 className="text-center fw-bold mb-5">🧠 Model Hub</h2>

      {/* Upload Model Section */}
      <section className="p-4 bg-dark rounded shadow mb-5 border border-secondary">
        <h4 className="mb-3">📤 Upload a New Model</h4>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Model Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control bg-secondary text-light"
                placeholder="e.g. ImageClassifier"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Model File (.h5, .pth, .pkl)</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                accept=".h5,.pth,.pkl"
                className="form-control bg-secondary text-light"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Framework</label>
              <select
                name="framework"
                value={formData.framework}
                onChange={handleChange}
                className="form-select bg-secondary text-light"
              >
                <option value="tensorflow">TensorFlow</option>
                <option value="pytorch">PyTorch</option>
                <option value="sklearn">Scikit-learn</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-info w-100 mt-4">Upload Model</button>
        </form>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </section>

      {/* Execute Model Section */}
      <section className="p-4 bg-dark rounded shadow mb-5 border border-secondary">
        <h4 className="mb-3">🚀 Run a Model</h4>
        <div className="mb-3">
          <label className="form-label">Choose Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="form-select bg-secondary text-light"
          >
            <option value="">-- Select a Model --</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.framework})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Input File</label>
          <input
            type="file"
            accept=".xlsx,.jpg,.jpeg,.png,.wav,.mp3"
            onChange={(e) => setInputFile(e.target.files[0])}
            className="form-control bg-secondary text-light"
          />
        </div>
        <button onClick={handleExecute} className="btn btn-success w-100" disabled={!selectedModel || !inputFile}>
          Run Prediction
        </button>

        {predictions && (
          <div className="mt-4">
            <h6>📈 Predictions</h6>
            <pre className="bg-secondary text-light p-3 rounded">{JSON.stringify(predictions, null, 2)}</pre>
          </div>
        )}
        {executeError && (
          <div className="mt-3 alert alert-danger">
            <strong>Error:</strong> {executeError}
          </div>
        )}
      </section>

      {/* Models Table Section */}
      <section className="p-4 bg-dark rounded shadow border border-secondary">
        <h4 className="mb-3">📚 Your Uploaded Models</h4>
        {models.length ? (
          <div className="table-responsive">
            <table className="table table-dark table-bordered align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Framework</th>
                  <th>Uploaded</th>
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
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(model.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted">No models uploaded yet.</p>
        )}
      </section>
    </div>
  );
};

export default ModelHub;
