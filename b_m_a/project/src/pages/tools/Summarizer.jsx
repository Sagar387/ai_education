import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, RefreshCw, Download, Trash2, FileSearch } from 'lucide-react';

const Summarizer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    const selectedFile = acceptedFiles[0];

    if (selectedFile) {
      setFile(selectedFile);

      if (selectedFile.type === 'text/plain') {
        // For plain text files, read the content and send as JSON
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target.result;
          setIsProcessing(true);
          fetch('http://localhost:8000/summarize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to generate summary.');
              }
              return response.json();
            })
            .then(data => {
              setSummary(data.summary);
            })
            .catch(err => {
              setError(err.message || 'Failed to generate summary. Please try again.');
            })
            .finally(() => setIsProcessing(false));
        };
        reader.readAsText(selectedFile);
      } else if (selectedFile.type === 'application/pdf') {
        // For PDFs, send the file using FormData
        const formData = new FormData();
        formData.append('file', selectedFile);
        setIsProcessing(true);
        fetch('http://localhost:8000/summarize', {
          method: 'POST',
          body: formData,
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to generate summary.');
            }
            return response.json();
          })
          .then(data => {
            setSummary(data.summary);
          })
          .catch(err => {
            setError(err.message || 'Failed to generate summary. Please try again.');
          })
          .finally(() => setIsProcessing(false));
      } else {
        setError('Please upload a valid text file (.txt) or PDF file (.pdf)');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleReset = () => {
    setFile(null);
    setSummary('');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 p-3 rounded-full">
          <FileSearch className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Text Summarizer</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Upload Section */}
        <div className="p-8 border-b border-gray-100">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            } ${file ? 'bg-gray-50' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <Upload className={`h-10 w-10 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {file ? (
                <>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Only .txt and .pdf files are supported
                  </p>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Summary Section */}
        {(isProcessing || summary) && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
                {summary && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Download className="h-4 w-4" />
                    Download Summary
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Generating summary...</span>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{summary}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summarizer;
