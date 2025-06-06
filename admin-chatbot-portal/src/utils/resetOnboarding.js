/**
 * Utility to reset the onboarding state for testing purposes
 * Usage: import and call resetOnboardingState() from any component or the console
 */

export const resetOnboardingState = () => {
  // Clear all onboarding-related localStorage items
  localStorage.removeItem('onboardingComplete');
  localStorage.removeItem('userConfig');
  localStorage.removeItem('chatbotAppearance');
  localStorage.removeItem('chatbotButton');
  localStorage.removeItem('chatbotGreetings');
  
  console.log('Onboarding state reset. Refresh the page to see the onboarding process.');
  
  // Optional: Return true to indicate success
  return true;
};

// If this file is loaded directly in the browser console, execute the reset
if (typeof window !== 'undefined' && window.document && window.document.createElement) {
  window.resetOnboardingState = resetOnboardingState;
  console.log('Reset function attached to window.resetOnboardingState()');
}
