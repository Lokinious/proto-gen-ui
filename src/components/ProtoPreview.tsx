import { useState } from 'react';
import { DataProduct } from '../types';
import { generateProtoFile, validateDataProduct, downloadProtoFile } from '../utils/protoGenerator';
import { toProtoPackageName, toProtoMessageName, toProtoFieldName } from '../utils/protoNaming';
import { generateCompilationInstructions, generateReadmeContent } from '../utils/compilationInstructions';

interface ProtoPreviewProps {
  dataProduct: DataProduct;
  onBack: () => void;
  onEdit: () => void;
}

interface ConversionItem {
  original: string;
  converted: string;
  type: 'package' | 'message' | 'field';
}

function generateConversionSummary(dataProduct: DataProduct): ConversionItem[] {
  const conversions: ConversionItem[] = [];
  
  // Data product name conversion
  const protoPackageName = toProtoPackageName(dataProduct.name);
  if (dataProduct.name !== protoPackageName) {
    conversions.push({
      original: dataProduct.name,
      converted: protoPackageName,
      type: 'package'
    });
  }
  
  // Entity name conversions
  dataProduct.entities.forEach(entity => {
    const protoMessageName = toProtoMessageName(entity.name);
    if (entity.name !== protoMessageName) {
      conversions.push({
        original: entity.name,
        converted: protoMessageName,
        type: 'message'
      });
    }
    
    // Field name conversions
    entity.attributes.forEach(attribute => {
      const protoFieldName = toProtoFieldName(attribute.name);
      if (attribute.name !== protoFieldName) {
        conversions.push({
          original: `${entity.name}.${attribute.name}`,
          converted: `${protoMessageName}.${protoFieldName}`,
          type: 'field'
        });
      }
    });
  });
  
  return conversions;
}

function ProtoPreview({ dataProduct, onBack, onEdit }: ProtoPreviewProps) {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success'>('idle');
  const [showInstructions, setShowInstructions] = useState(false);
  
  const validationErrors = validateDataProduct(dataProduct);
  const protoContent = validationErrors.length === 0 ? generateProtoFile(dataProduct) : '';
  const conversionSummary = generateConversionSummary(dataProduct);
  const compilationInstructions = generateCompilationInstructions(dataProduct.name);
  
  const handleDownload = () => {
    if (validationErrors.length > 0) return;
    
    setDownloadStatus('downloading');
    
    setTimeout(() => {
      downloadProtoFile(protoContent, dataProduct.name);
      setDownloadStatus('success');
      
      setTimeout(() => {
        setDownloadStatus('idle');
      }, 2000);
    }, 100);
  };

  const handleDownloadReadme = () => {
    const readmeContent = generateReadmeContent(dataProduct.name, compilationInstructions);
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApprove = () => {
    handleDownload();
  };

  return (
    <div className="step-container">
      <h2 className="step-header">Step 3: Proto File Preview</h2>
      <p>Review your generated Protocol Buffer file. You can download it or go back to make changes.</p>
      
      {validationErrors.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#dc3545', marginBottom: '12px' }}>Validation Errors:</h4>
          <ul style={{ color: '#dc3545', marginLeft: '20px' }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <p style={{ color: '#888' }}>
            Please go back and fix these errors before generating the proto file.
          </p>
        </div>
      )}

      {validationErrors.length === 0 && (
        <>
          {conversionSummary.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#ffc107', marginBottom: '12px' }}>📝 Naming Conversions Applied</h4>
              <p style={{ color: '#888', marginBottom: '16px' }}>
                The following names were automatically converted to Protocol Buffer naming standards:
              </p>
              <div className="conversion-summary">
                {conversionSummary.map((conversion, index) => (
                  <div key={index} className="conversion-item">
                    <span className="conversion-type">
                      {conversion.type === 'package' ? '📦 Package' : 
                       conversion.type === 'message' ? '📋 Message' : 
                       '🏷️ Field'}:
                    </span>
                    <span className="conversion-original">{conversion.original}</span>
                    <span className="conversion-arrow">→</span>
                    <span className="conversion-converted">{conversion.converted}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#28a745', marginBottom: '8px' }}>✓ Proto file is ready!</h4>
            <p style={{ color: '#888' }}>
              Your proto file has been generated successfully. Review the content below and download when ready.
            </p>
          </div>

          <div className="proto-preview">
            {protoContent}
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ color: '#61dafb', margin: 0 }}>🛠️ Compilation Instructions</h4>
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {showInstructions ? 'Hide' : 'Show'} Instructions
              </button>
            </div>
            
            {showInstructions && (
              <div className="compilation-instructions">
                <div className="instruction-section">
                  <h5>☕ Java</h5>
                  <div className="code-block">
                    <strong>Compilation:</strong>
                    <pre>{compilationInstructions.java.compileCommand}</pre>
                    
                    <strong>Maven Dependency:</strong>
                    <pre>{`<dependency>
    <groupId>com.google.protobuf</groupId>
    <artifactId>protobuf-java</artifactId>
    <version>3.25.1</version>
</dependency>`}</pre>

                    <strong>Package:</strong> com.{toProtoPackageName(dataProduct.name).replace(/_/g, '.')}
                  </div>
                </div>
                
                <div className="instruction-section">
                  <h5>🐹 Go</h5>
                  <div className="code-block">
                    <strong>Compilation:</strong>
                    <pre>{compilationInstructions.go.compileCommand}</pre>
                    
                    <strong>Dependencies:</strong>
                    <pre>{compilationInstructions.go.dependencies.map(dep => `go get ${dep}`).join('\n')}</pre>

                    <strong>Package:</strong> ./{toProtoPackageName(dataProduct.name)};{toProtoPackageName(dataProduct.name)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h4>Ready for Java & Go Development!</h4>
            <p style={{ color: '#888', marginBottom: '16px' }}>
              Your proto file includes language-specific options for Java and Go. Download the files to get started.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onEdit}
                className="btn btn-secondary"
              >
                Make Changes
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="btn btn-success"
                disabled={downloadStatus === 'downloading'}
              >
                {downloadStatus === 'downloading' ? 'Downloading...' : 
                 downloadStatus === 'success' ? '✓ Downloaded!' : 
                 'Download .proto File'}
              </button>
              <button
                type="button"
                onClick={handleDownloadReadme}
                className="btn btn-primary"
              >
                📋 Download README.md
              </button>
            </div>
            
            {downloadStatus === 'success' && (
              <div className="success" style={{ marginTop: '12px' }}>
                Proto file downloaded successfully! Don't forget to download the README for compilation instructions.
              </div>
            )}
          </div>
        </>
      )}

      <div className="navigation" style={{ marginTop: '32px' }}>
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Back: Edit Entities
        </button>
        
        <div style={{ color: '#888', fontSize: '14px' }}>
          💡 Tip: Download both the .proto file and README.md for complete setup instructions
        </div>
      </div>
    </div>
  );
}

export default ProtoPreview;
