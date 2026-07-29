/**
 * Vercel Speed Insights Integration
 * 
 * This script initializes Vercel Speed Insights for performance monitoring.
 * Based on @vercel/speed-insights package v1.3.1
 * 
 * For more information: https://vercel.com/docs/speed-insights
 */

(function() {
  'use strict';
  
  // Initialize the Speed Insights queue
  if (!window.si) {
    window.si = function() {
      (window.siq = window.siq || []).push(arguments);
    };
  }
  
  // Check if already loaded
  const scriptSrc = '/_vercel/speed-insights/script.js';
  if (document.head.querySelector(`script[src*="${scriptSrc}"]`)) {
    return;
  }
  
  // Create and inject the Speed Insights script
  const script = document.createElement('script');
  script.src = scriptSrc;
  script.defer = true;
  script.setAttribute('data-sdkn', '@vercel/speed-insights');
  script.setAttribute('data-sdkv', '1.3.1');
  
  script.onerror = function() {
    console.log(
      '[Vercel Speed Insights] Failed to load script from ' + scriptSrc + 
      '. Please check if any content blockers are enabled and try again.'
    );
  };
  
  document.head.appendChild(script);
})();
