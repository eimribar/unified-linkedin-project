import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const Import = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    // Simulate import process
    setTimeout(() => {
      setImporting(false);
      setStatus('success');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-900 mb-2">Import Content</h1>
      <p className="text-zinc-600 mb-8">Upload your existing content to get started quickly</p>

      <div className="bg-white rounded-xl border border-zinc-200 p-8">
        <div className="border-2 border-dashed border-zinc-200 rounded-lg p-12 text-center">
          <Upload className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-zinc-900 font-medium">Click to upload</span>
            <span className="text-zinc-500"> or drag and drop</span>
            <input
              id="file-upload"
              type="file"
              className="sr-only"
              accept=".csv,.xlsx,.json"
              onChange={handleFileChange}
            />
          </label>
          
          <p className="text-sm text-zinc-500 mt-2">CSV, XLSX, or JSON (max 10MB)</p>
          
          {file && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-lg">
              <FileText className="w-4 h-4 text-zinc-600" />
              <span className="text-sm text-zinc-700">{file.name}</span>
            </div>
          )}
        </div>

        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Content imported successfully!
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Failed to import content. Please try again.
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="mt-6 w-full py-3 px-4 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          {importing ? 'Importing...' : 'Import Content'}
        </button>
      </div>
    </div>
  );
};

export default Import;