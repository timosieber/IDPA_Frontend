(function () {
  try {
    var cfg = (window.ChatBotConfig = window.ChatBotConfig || {});
    if (!cfg.chatbotId) {
      console.error('[ChatBot] Missing chatbotId in window.ChatBotConfig');
      return;
    }

    // Determine base URL (where widget is hosted)
    var currentScript = document.currentScript || (function () {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();
    var scriptOrigin = (function () {
      try {
        return new URL(currentScript.src).origin;
      } catch (e) {
        return window.location.origin;
      }
    })();
    var baseUrl = cfg.baseUrl || scriptOrigin;

    // Create container
    var container = document.createElement('div');
    container.id = 'chatbot-launcher';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '2147483647';
    container.style.width = '360px';
    container.style.height = '600px';
    container.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    container.style.borderRadius = '12px';
    container.style.overflow = 'hidden';

    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.src = baseUrl + '/widget?chatbotId=' + encodeURIComponent(cfg.chatbotId);
    iframe.title = 'ChatBot Widget';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.setAttribute('referrerpolicy', 'origin');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');

    container.appendChild(iframe);
    document.body.appendChild(container);
  } catch (e) {
    console.error('[ChatBot] Failed to load widget:', e);
  }
})();

