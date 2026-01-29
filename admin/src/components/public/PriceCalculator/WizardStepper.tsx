interface Step {
  id: number;
  label: string;
  icon: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

export default function WizardStepper({ steps, currentStep }: Props) {
  return (
    <div className="wizard-stepper" style={{ marginBottom: '50px' }}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`stepper-item ${currentStep === step.id ? 'active' : ''} ${
            currentStep > step.id ? 'completed' : ''
          }`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            flex: 1,
            maxWidth: '200px',
          }}
        >
          {/* Circle */}
          <div
            className="stepper-circle"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background:
                currentStep > step.id
                  ? '#4185DD'
                  : currentStep === step.id
                  ? 'linear-gradient(135deg, #4185DD, #B42FDA)'
                  : 'var(--secondary-color)',
              border: `2px solid ${
                currentStep >= step.id ? '#4185DD' : 'var(--divider-color)'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '600',
              color: currentStep >= step.id ? 'white' : 'var(--text-color)',
              transition: 'all 0.3s ease',
              marginBottom: '15px',
            }}
          >
            {currentStep > step.id ? '✓' : step.icon}
          </div>

          {/* Label */}
          <div
            className="stepper-label"
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: currentStep >= step.id ? 'var(--primary-color)' : 'var(--text-color)',
              textAlign: 'center',
            }}
          >
            {step.label}
          </div>

          {/* Line */}
          {index < steps.length - 1 && (
            <div
              style={{
                position: 'absolute',
                top: '25px',
                left: '50%',
                width: 'calc(100% + 50px)',
                height: '2px',
                background: currentStep > step.id ? '#4185DD' : 'var(--divider-color)',
                zIndex: -1,
                transition: 'all 0.3s ease',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
