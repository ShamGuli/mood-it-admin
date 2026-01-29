'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import WizardStepper from './WizardStepper';
import StepCategory from './Steps/StepCategory';
import StepBrand from './Steps/StepBrand';
import StepModel from './Steps/StepModel';
import StepService from './Steps/StepService';
import StepResults from './Steps/StepResults';

interface WizardData {
  category?: any;
  brand?: any;
  model?: any;
  services?: any[];
}

const STEPS = [
  { id: 1, label: 'Kateqoriya', icon: '1' },
  { id: 2, label: 'Brend', icon: '2' },
  { id: 3, label: 'Model', icon: '3' },
  { id: 4, label: 'Xidmət', icon: '4' },
];

export default function PriceCalculatorWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category: any) => {
    setWizardData({ category });
    setTimeout(() => handleNext(), 300);
  };

  const handleBrandSelect = (brand: any) => {
    setWizardData({ ...wizardData, brand });
    setTimeout(() => handleNext(), 300);
  };

  const handleModelSelect = (model: any) => {
    setWizardData({ ...wizardData, model });
    setTimeout(() => handleNext(), 300);
  };

  const handleServicesSelect = (services: any[]) => {
    setWizardData({ ...wizardData, services });
  };

  const handleReset = () => {
    setWizardData({});
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="price-calculator-wizard">
      {/* Stepper */}
      <WizardStepper steps={STEPS} currentStep={currentStep} />

      {/* Wizard Content */}
      <div className="wizard-content">
        {/* Step 1: Category */}
        {currentStep === 1 && (
          <StepCategory onSelect={handleCategorySelect} />
        )}

        {/* Step 2: Brand */}
        {currentStep === 2 && wizardData.category && (
          <StepBrand
            categoryId={wizardData.category.id}
            onSelect={handleBrandSelect}
            onBack={handleBack}
          />
        )}

        {/* Step 3: Model */}
        {currentStep === 3 && wizardData.brand && (
          <StepModel
            brandId={wizardData.brand.id}
            onSelect={handleModelSelect}
            onBack={handleBack}
          />
        )}

        {/* Step 4: Service */}
        {currentStep === 4 && wizardData.category && (
          <StepService
            categoryId={wizardData.category.id}
            selectedServices={wizardData.services || []}
            onSelect={handleServicesSelect}
            onBack={handleBack}
            onFinish={() => {
              if (!wizardData.services || wizardData.services.length === 0) {
                toast.error('Ən azı bir xidmət seçin');
                return;
              }
              setCurrentStep(5);
            }}
          />
        )}

        {/* Step 5: Results */}
        {currentStep === 5 && (
          <StepResults
            wizardData={wizardData}
            onReset={handleReset}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
