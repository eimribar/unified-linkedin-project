// PWA Installation Prompt Handler
// This helps trigger the install prompt on supported devices

let deferredPrompt;
let isInstallPromptShown = false;

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button or banner after a delay
  setTimeout(() => {
    if (!isInstallPromptShown) {
      showInstallPrompt();
    }
  }, 3000);
});

// Function to show install prompt
function showInstallPrompt() {
  if (!deferredPrompt || isInstallPromptShown) return;
  
  isInstallPromptShown = true;
  
  // Create install banner
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #3B82F6;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 320px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
    ">
      <div>Install AgentSS app for easy access</div>
      <button id="pwa-install-btn" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
      ">Install</button>
      <button id="pwa-dismiss-btn" style="
        background: none;
        border: none;
        color: rgba(255,255,255,0.8);
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        padding: 0;
        width: 20px;
        height: 20px;
      ">×</button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Handle install button click
  document.getElementById('pwa-install-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('PWA install outcome:', outcome);
      deferredPrompt = null;
    }
    banner.remove();
  });
  
  // Handle dismiss button click
  document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
    banner.remove();
  });
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (banner.parentNode) {
      banner.remove();
    }
  }, 10000);
}

// Listen for successful installation
window.addEventListener('appinstalled', (evt) => {
  console.log('PWA was installed successfully');
});

// For iOS Safari - detect if running in standalone mode
function isRunningStandalone() {
  return (window.navigator.standalone) || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
}

// Show iOS install instructions if not already installed
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !isRunningStandalone()) {
  setTimeout(() => {
    if (!isInstallPromptShown) {
      showIOSInstallPrompt();
    }
  }, 5000);
}

function showIOSInstallPrompt() {
  if (isInstallPromptShown) return;
  isInstallPromptShown = true;
  
  const banner = document.createElement('div');
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #3B82F6;
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 9999;
      max-width: 320px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      text-align: center;
    ">
      <div style="margin-bottom: 8px;">Install AgentSS App</div>
      <div style="font-size: 12px; opacity: 0.9; margin-bottom: 12px;">
        Tap <span style="font-weight: bold;">Share</span> → <span style="font-weight: bold;">Add to Home Screen</span>
      </div>
      <button onclick="this.parentElement.remove()" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
      ">Got it</button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  setTimeout(() => {
    if (banner.parentNode) {
      banner.remove();
    }
  }, 15000);
}