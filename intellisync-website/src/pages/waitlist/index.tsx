import React, { useState, useEffect } from 'react';
import { useTracking } from '../../utils/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { waitlistConfig } from '../../data/waitlistConfig';
import { 
  WaitlistVariant, 
  WaitlistAnswer, 
  WaitlistSubmission
} from '../../types/waitlist';
import { waitlistApi, waitlistStorage } from '../../lib/api';
import VariantSelector from '../../components/waitlist/VariantSelector';
import ProgressBar from '../../components/waitlist/ProgressBar';
import QuestionStep from '../../components/waitlist/QuestionStep';
import EmailCapture from '../../components/waitlist/EmailCapture';
import SuccessScreen from '../../components/waitlist/SuccessScreen';

// Using a placeholder for now - replace with actual logo path
const logo = '../../assets/logo.png';

const WaitlistPage: React.FC = () => {
  // State for tracking the current step and variant
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [variant, setVariant] = useState<WaitlistVariant | undefined>(undefined);
  const [answers, setAnswers] = useState<WaitlistAnswer[]>([]);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get the current config based on the selected variant
  const currentConfig = variant ? waitlistConfig[variant] : null;
  const steps = currentConfig?.steps || [];
  const totalSteps = steps.length;

  // Clear any saved progress on mount to always show variant selection
  useEffect(() => {
    // Clear any saved progress to always show variant selection
    waitlistStorage.clearProgress();
    
    // Reset all state to initial values
    setVariant(undefined);
    setCurrentStep(0);
    setAnswers([]);
    setEmail('');
    setName('');
    setIsSubmitted(false);
  }, []);

  // Save progress to localStorage whenever relevant state changes
  useEffect(() => {
    if (variant || answers.length > 0 || currentStep > 0 || email) {
      waitlistStorage.saveProgress({
        variant,
        currentStep,
        answers,
        email,
        name
      });
    }
  }, [variant, currentStep, answers, email, name]);

  // Handle variant selection
  const handleVariantSelect = (selectedVariant: WaitlistVariant) => {
    setVariant(selectedVariant);
    setCurrentStep(1);
  };

  // Handle switching variant
  const handleSwitchVariant = () => {
    setVariant(undefined);
    setCurrentStep(0);
    setAnswers([]);
  };

  // Handle question answer
  const handleAnswer = (answer: WaitlistAnswer) => {
    // Update or add the answer
    const existingIndex = answers.findIndex(a => a.stepId === answer.stepId);
    
    if (existingIndex >= 0) {
      const updatedAnswers = [...answers];
      updatedAnswers[existingIndex] = answer;
      setAnswers(updatedAnswers);
    } else {
      setAnswers([...answers, answer]);
    }
    
    // Move to the next step
    setCurrentStep(prev => prev + 1);
  };

  // Handle skipping a question
  const handleSkip = () => {
    setCurrentStep(prev => prev + 1);
  };

  // Get previous answer for a step if it exists
  const getPreviousAnswer = (stepId: string) => {
    const answer = answers.find(a => a.stepId === stepId);
    return answer ? answer.answer : undefined;
  };

  const { trackFormSubmission, trackButtonClick } = useTracking();

  // Handle email submission
  const handleEmailSubmit = async (submittedEmail: string, submittedName: string) => {
    if (!variant || !submittedName || !submittedName.trim()) return;
    
    setEmail(submittedEmail);
    setName(submittedName);
    
    setIsLoading(true);
    
    // Prepare submission data
    const submissionData: WaitlistSubmission = {
      email: submittedEmail,
      name: submittedName,
      variant,
      answers
    };
    
    // Track form start as a button click event
    trackButtonClick('Waitlist Form Started', 'Waitlist', {
      variant,
      nameLength: submittedName.length,
      answerCount: answers.length,
      eventType: 'form_started'
    });
    
    try {
      // Submit to API
      const result = await waitlistApi.submitWaitlist(submissionData);
      
      if (result.success) {
        // Track successful submission
        trackFormSubmission('Waitlist Form', 'success', {
          variant,
          nameLength: submittedName.length,
          answerCount: answers.length,
          answers: JSON.stringify(answers.map(a => ({
            stepId: a.stepId,
            answerType: typeof a.answer === 'string' ? 'text' : 
                        Array.isArray(a.answer) ? 'multi-select' : 'other'
          })))
        });
        
        // Clear localStorage on successful submission
        waitlistStorage.clearProgress();
        setIsSubmitted(true);
      } else {
        // Track submission failure
        trackFormSubmission('Waitlist Form', 'error', {
          variant,
          error: result.message || 'Unknown error',
          nameLength: submittedName.length,
          answerCount: answers.length
        });
        console.error('Submission failed:', result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      // Track error
      trackFormSubmission('Waitlist Form', 'error', {
        variant,
        error: errorMessage,
        nameLength: submittedName.length,
        answerCount: answers.length
      });
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Loading indicator component that uses isLoading state
  const LoadingIndicator = () => {
    if (!isLoading) return null;
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent1"></div>
      </div>
    );
  };

  // Render the current step
  const renderStep = () => {
    // Step 0: Variant selection
    if (currentStep === 0) {
      return <VariantSelector onSelect={handleVariantSelect} />;
    }
    
    // If no variant is selected yet, show variant selection
    if (!variant || !currentConfig) {
      return <VariantSelector onSelect={handleVariantSelect} />;
    }
    
    // If all questions are answered, show email capture
    if (currentStep > totalSteps) {
      return (
        <EmailCapture 
          finalCTA={currentConfig.final_cta}
          onSubmit={handleEmailSubmit}
          variant={variant}
          initialEmail={email}
          initialName={name}
        />
      );
    }
    
    // Show the current question
    const currentQuestion = steps[currentStep - 1];
    if (!currentQuestion) return null;
    
    return (
      <QuestionStep 
        step={currentQuestion}
        onAnswer={handleAnswer}
        previousAnswer={getPreviousAnswer(currentQuestion.id)}
        onSkip={handleSkip}
      />
    );
  };

  return (
    <>
      <Header />
      <div 
        className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] py-8 px-4 relative overflow-hidden"
      >
      {/* Animated glassmorphic overlays similar to home page */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-8%] left-[-5%] w-[36vw] h-[36vw] bg-gradient-to-tr from-cta/40 to-accent1/30 rounded-full blur-3xl opacity-70 animate-pulse-slow" />
        <div className="absolute bottom-[-8%] right-[-5%] w-[28vw] h-[28vw] bg-gradient-to-tr from-accent2/50 to-primary/40 rounded-full blur-2xl opacity-60 animate-pulse-slower" />
      </div>
      {/* Header with logo and variant switcher */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Intellisync Solutions" className="h-10" />
          <span className="ml-2 text-xl font-bold bg-gradient-to-tr from-cta via-accent1 to-white bg-clip-text text-transparent">Intellisync Solutions</span>
        </Link>
        
        {variant && currentStep > 0 && !isSubmitted && (
          <motion.button 
            onClick={handleSwitchVariant}
            className="text-sm text-accent1 hover:text-accent1/80 px-4 py-2 rounded-full border border-accent1/30 hover:border-accent1/60 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Switch variant
          </motion.button>
        )}
      </div>
      
      {/* Main content container */}
      <div className="w-full max-w-2xl bg-black/30 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-accent2 relative overflow-hidden">
        {/* Loading indicator */}
        <LoadingIndicator />
        
        {/* Progress bar (only show when a variant is selected and not on success screen) */}
        {variant && currentStep > 0 && currentStep <= totalSteps && !isSubmitted && (
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        )}
        
        {/* Main content with animations */}
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <SuccessScreen email={email} />
          ) : (
            <motion.div
              key={`step-${currentStep}-${variant || 'none'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
      <Footer />
    </>
  );

};

export default WaitlistPage;
