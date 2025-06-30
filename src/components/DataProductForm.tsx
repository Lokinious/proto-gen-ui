import { useState } from 'react';
import ProtoNamingSuggestion from './ProtoNamingSuggestion';

interface DataProductFormProps {
  initialName: string;
  onSubmit: (name: string) => void;
}

function DataProductForm({ initialName, onSubmit }: DataProductFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Data product name is required');
      return;
    }
    
    setError('');
    onSubmit(name);
  };

  return (
    <div className="step-container">
      <h2 className="step-header">Step 1: Data Product Name</h2>
      <p>Enter the name of your data product. This will become the package name in your proto file.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dataProductName">Data Product Name</label>
          <input
            type="text"
            id="dataProductName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., UserManagement, OrderService, ProductCatalog"
          />
          {error && <div className="error">{error}</div>}
          <ProtoNamingSuggestion 
            value={name} 
            type="package" 
            onChange={setName}
          />
          <small style={{ color: '#888', fontSize: '12px' }}>
            Name will be converted to proto package naming standard (lowercase with underscores)
          </small>
        </div>
        
        <button type="submit" className="btn btn-primary">
          Next: Define Entities
        </button>
      </form>
    </div>
  );
}

export default DataProductForm;
