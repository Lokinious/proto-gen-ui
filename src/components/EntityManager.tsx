import { useState } from 'react';
import { Entity, Attribute, JAVA_PRIMITIVE_TYPES } from '../types';
import { generateUniqueId } from '../utils/protoGenerator';
import ProtoNamingSuggestion from './ProtoNamingSuggestion';

interface EntityManagerProps {
  entities: Entity[];
  onEntitiesUpdate: (entities: Entity[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function EntityManager({ entities, onEntitiesUpdate, onNext, onBack }: EntityManagerProps) {
  const [newEntityName, setNewEntityName] = useState('');
  const [editingEntity, setEditingEntity] = useState<string | null>(null);
  const [error, setError] = useState('');

  const addEntity = () => {
    if (!newEntityName.trim()) {
      setError('Entity name is required');
      return;
    }

    if (entities.some(entity => entity.name.toLowerCase() === newEntityName.toLowerCase())) {
      setError('Entity name already exists');
      return;
    }

    const newEntity: Entity = {
      id: generateUniqueId(),
      name: newEntityName,
      attributes: []
    };

    onEntitiesUpdate([...entities, newEntity]);
    setNewEntityName('');
    setError('');
    setEditingEntity(newEntity.id);
  };

  const removeEntity = (entityId: string) => {
    onEntitiesUpdate(entities.filter(entity => entity.id !== entityId));
  };

  const updateEntity = (entityId: string, updatedEntity: Entity) => {
    onEntitiesUpdate(
      entities.map(entity => entity.id === entityId ? updatedEntity : entity)
    );
  };

  const addAttributeToEntity = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;

    const newAttribute: Attribute = {
      id: generateUniqueId(),
      name: '',
      type: 'String',
      isPrimaryKey: false
    };

    const updatedEntity = {
      ...entity,
      attributes: [...entity.attributes, newAttribute]
    };

    updateEntity(entityId, updatedEntity);
  };

  const updateAttribute = (entityId: string, attributeId: string, updatedAttribute: Attribute) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;

    const updatedEntity = {
      ...entity,
      attributes: entity.attributes.map(attr => 
        attr.id === attributeId ? updatedAttribute : attr
      )
    };

    updateEntity(entityId, updatedEntity);
  };

  const removeAttribute = (entityId: string, attributeId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;

    const updatedEntity = {
      ...entity,
      attributes: entity.attributes.filter(attr => attr.id !== attributeId)
    };

    updateEntity(entityId, updatedEntity);
  };

  const handleNext = () => {
    if (entities.length === 0) {
      setError('At least one entity is required');
      return;
    }

    const validation = entities.every(entity => {
      const hasAttributes = entity.attributes.length > 0;
      const hasPrimaryKey = entity.attributes.some(attr => attr.isPrimaryKey);
      const hasValidNames = entity.attributes.every(attr => attr.name.trim() !== '');
      
      return hasAttributes && hasPrimaryKey && hasValidNames;
    });

    if (!validation) {
      setError('Each entity must have at least one attribute, one primary key, and all attributes must have names');
      return;
    }

    setError('');
    onNext();
  };

  return (
    <div className="step-container">
      <h2 className="step-header">Step 2: Define Entities</h2>
      <p>Create Java entities with their attributes and primary keys.</p>
      
      {error && <div className="error" style={{ marginBottom: '16px' }}>{error}</div>}
      
      <div className="form-group">
        <label htmlFor="newEntityName">Add New Entity</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              id="newEntityName"
              value={newEntityName}
              onChange={(e) => setNewEntityName(e.target.value)}
              placeholder="e.g., User, Order, Product"
              style={{ width: '100%' }}
              onKeyPress={(e) => e.key === 'Enter' && addEntity()}
            />
            <ProtoNamingSuggestion 
              value={newEntityName} 
              type="message" 
              onChange={setNewEntityName}
            />
          </div>
          <button type="button" onClick={addEntity} className="btn btn-primary">
            Add Entity
          </button>
        </div>
      </div>

      <div className="entities-list">
        {entities.map(entity => (
          <EntityCard
            key={entity.id}
            entity={entity}
            isEditing={editingEntity === entity.id}
            onEdit={() => setEditingEntity(entity.id)}
            onStopEditing={() => setEditingEntity(null)}
            onRemove={() => removeEntity(entity.id)}
            onAddAttribute={() => addAttributeToEntity(entity.id)}
            onUpdateAttribute={(attributeId, updatedAttribute) => 
              updateAttribute(entity.id, attributeId, updatedAttribute)
            }
            onRemoveAttribute={(attributeId) => removeAttribute(entity.id, attributeId)}
          />
        ))}
      </div>

      <div className="navigation">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Back: Data Product
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          Next: Preview Proto
        </button>
      </div>
    </div>
  );
}

interface EntityCardProps {
  entity: Entity;
  isEditing: boolean;
  onEdit: () => void;
  onStopEditing: () => void;
  onRemove: () => void;
  onAddAttribute: () => void;
  onUpdateAttribute: (attributeId: string, attribute: Attribute) => void;
  onRemoveAttribute: (attributeId: string) => void;
}

function EntityCard({
  entity,
  isEditing,
  onEdit,
  onStopEditing,
  onRemove,
  onAddAttribute,
  onUpdateAttribute,
  onRemoveAttribute
}: EntityCardProps) {
  return (
    <div className="entity-card">
      <div className="entity-header">
        <h3 className="entity-name">{entity.name}</h3>
        <div>
          <button
            type="button"
            onClick={isEditing ? onStopEditing : onEdit}
            className="btn btn-secondary"
            style={{ marginRight: '8px' }}
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-danger"
          >
            Remove
          </button>
        </div>
      </div>

      {isEditing && (
        <div>
          <button
            type="button"
            onClick={onAddAttribute}
            className="btn btn-primary"
            style={{ marginBottom: '12px' }}
          >
            Add Attribute
          </button>
        </div>
      )}

      <div className="attribute-list">
        {entity.attributes.map(attribute => (
          <AttributeItem
            key={attribute.id}
            attribute={attribute}
            isEditing={isEditing}
            onUpdate={(updatedAttribute) => onUpdateAttribute(attribute.id, updatedAttribute)}
            onRemove={() => onRemoveAttribute(attribute.id)}
          />
        ))}
      </div>

      {entity.attributes.length === 0 && (
        <p style={{ color: '#888', fontStyle: 'italic' }}>
          No attributes defined. {isEditing ? 'Click "Add Attribute" to get started.' : 'Click "Edit" to add attributes.'}
        </p>
      )}
    </div>
  );
}

interface AttributeItemProps {
  attribute: Attribute;
  isEditing: boolean;
  onUpdate: (attribute: Attribute) => void;
  onRemove: () => void;
}

function AttributeItem({ attribute, isEditing, onUpdate, onRemove }: AttributeItemProps) {
  if (isEditing) {
    return (
      <div className="attribute-item">
        <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={attribute.name}
              onChange={(e) => onUpdate({ ...attribute, name: e.target.value })}
              placeholder="Attribute name"
              style={{ width: '100%' }}
            />
            <ProtoNamingSuggestion 
              value={attribute.name} 
              type="field" 
              onChange={(newName) => onUpdate({ ...attribute, name: newName })}
              className="compact"
            />
          </div>
          <select
            value={attribute.type}
            onChange={(e) => onUpdate({ ...attribute, type: e.target.value as any })}
            style={{ flex: 1 }}
          >
            {JAVA_PRIMITIVE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <input
              type="checkbox"
              checked={attribute.isPrimaryKey}
              onChange={(e) => onUpdate({ ...attribute, isPrimaryKey: e.target.checked })}
            />
            Primary Key
          </label>
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-danger"
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="attribute-item">
      <span>
        <strong>{attribute.name}</strong>: {attribute.type}
        {attribute.isPrimaryKey && <span style={{ color: '#61dafb', marginLeft: '8px' }}>(PK)</span>}
      </span>
    </div>
  );
}

export default EntityManager;
