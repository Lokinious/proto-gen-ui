import { useState } from 'react';
import { DataProduct, Entity } from './types';
import DataProductForm from './components/DataProductForm';
import EntityManager from './components/EntityManager';
import ProtoPreview from './components/ProtoPreview';

type Step = 'dataProduct' | 'entities' | 'preview';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('dataProduct');
  const [dataProduct, setDataProduct] = useState<DataProduct>({
    name: '',
    entities: []
  });

  const handleDataProductSubmit = (name: string) => {
    setDataProduct(prev => ({ ...prev, name }));
    setCurrentStep('entities');
  };

  const handleEntitiesUpdate = (entities: Entity[]) => {
    setDataProduct(prev => ({ ...prev, entities }));
  };

  const handleGoToPreview = () => {
    setCurrentStep('preview');
  };

  const handleBackToEntities = () => {
    setCurrentStep('entities');
  };

  const handleBackToDataProduct = () => {
    setCurrentStep('dataProduct');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'dataProduct':
        return (
          <DataProductForm
            initialName={dataProduct.name}
            onSubmit={handleDataProductSubmit}
          />
        );
      case 'entities':
        return (
          <EntityManager
            entities={dataProduct.entities}
            onEntitiesUpdate={handleEntitiesUpdate}
            onNext={handleGoToPreview}
            onBack={handleBackToDataProduct}
          />
        );
      case 'preview':
        return (
          <ProtoPreview
            dataProduct={dataProduct}
            onBack={handleBackToEntities}
            onEdit={handleBackToEntities}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Proto Gen UI</h1>
        <p>Generate Protocol Buffer files from Java entities</p>
      </header>
      
      <div className="step-indicator">
        <div className={`step ${currentStep === 'dataProduct' ? 'active' : ''}`}>
          1. Data Product
        </div>
        <div className={`step ${currentStep === 'entities' ? 'active' : ''}`}>
          2. Entities
        </div>
        <div className={`step ${currentStep === 'preview' ? 'active' : ''}`}>
          3. Preview
        </div>
      </div>

      {renderStep()}
    </div>
  );
}

export default App;
