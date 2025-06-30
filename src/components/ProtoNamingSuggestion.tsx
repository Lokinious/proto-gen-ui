import { validateProtoNaming } from '../utils/protoNaming';

interface ProtoNamingSuggestionProps {
  value: string;
  type: 'package' | 'message' | 'field';
  onChange?: (suggestion: string) => void;
  className?: string;
}

function ProtoNamingSuggestion({ value, type, onChange, className = '' }: ProtoNamingSuggestionProps) {
  if (!value.trim()) return null;
  
  const validation = validateProtoNaming(value, type);
  
  if (validation.isValid) {
    return (
      <div className={`proto-suggestion valid ${className}`}>
        ✓ Proto-compliant naming
      </div>
    );
  }
  
  return (
    <div className={`proto-suggestion invalid ${className}`}>
      <div className="suggestion-header">
        <span className="warning-icon">⚠️</span>
        <span>Will be converted to proto standard:</span>
      </div>
      <div className="suggestion-content">
        <strong>{validation.suggestion}</strong>
        {onChange && (
          <button
            type="button"
            onClick={() => onChange(validation.suggestion)}
            className="btn-suggestion"
          >
            Use This
          </button>
        )}
      </div>
      {validation.issues.length > 0 && (
        <div className="suggestion-issues">
          {validation.issues.map((issue, index) => (
            <div key={index} className="issue">• {issue}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProtoNamingSuggestion;
