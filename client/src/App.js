import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [dnaSequence, setDnaSequence] = useState('');
  const [processedDna, setProcessedDna] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let sequenceToProcess = dnaSequence;

    if (!dnaSequence && !file) {
      alert('Please enter a DNA sequence or upload a FASTA file');
      return;
    }

    if (file) {
      try {
        const fileText = await file.text();
        const fastaSequence = fileText.split('\n').slice(1).join('').trim();
        sequenceToProcess = fastaSequence;
      } catch (error) {
        alert('Error reading the FASTA file');
        console.error(error);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/process-dna', {
        dnaSequence: sequenceToProcess,
      });

      setProcessedDna(response.data.processedDna);
    } catch (error) {
      console.error('Error processing DNA:', error);
      alert('Error processing DNA sequence');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(processedDna);
    alert('Processed DNA sequence copied to clipboard!');
  };

  const lineWidth = Math.floor(window.innerWidth * 0.4 / 10);

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>DNA Sequence Processor</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Enter DNA Sequence:</label>
          <input
            type="text"
            value={dnaSequence}
            onChange={(e) => setDnaSequence(e.target.value)}
            placeholder="Enter DNA sequence"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Or Upload FASTA File:</label>
          <input
            type="file"
            accept=".fasta"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Process DNA'}
        </button>
      </form>

      {processedDna && (
        <div>
          <h2>Processed DNA Sequence</h2>
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              width: `${lineWidth * 10}px`,
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9',
            }}
          >
            {processedDna.match(new RegExp(`.{1,${lineWidth}}`, 'g')).map((line, index) => (
              <div key={index} style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {line}
              </div>
            ))}
          </div>
          <button
            onClick={copyToClipboard}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
