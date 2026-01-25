(function () {
  try {
    // Prevent double initialization
    if (window.__chatbotWidgetLoaded) return;
    window.__chatbotWidgetLoaded = true;

    var cfg = (window.ChatBotConfig = window.ChatBotConfig || {});
    if (!cfg.chatbotId) {
      console.error('[ChatBot] Missing chatbotId in window.ChatBotConfig');
      return;
    }

    // Don't load widget on the widget page itself
    if (window.location.pathname === '/widget') return;

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

    // Launcher button (minimized by default)
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Chat öffnen');
    button.style.width = '56px';
    button.style.height = '56px';
    button.style.borderRadius = '999px';
    button.style.border = '0';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 10px 30px rgba(0,0,0,0.18)';
    button.style.background = '#4F46E5';
    button.style.color = '#fff';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.fontSize = '18px';
    button.textContent = '💬';

    // Tooltip message when minimized
    var tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.right = '68px';
    tooltip.style.bottom = '10px';
    tooltip.style.maxWidth = '240px';
    tooltip.style.padding = '10px 12px';
    tooltip.style.borderRadius = '12px';
    tooltip.style.background = '#fff';
    tooltip.style.color = '#111827';
    tooltip.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
    tooltip.style.border = '1px solid rgba(0,0,0,0.08)';
    tooltip.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    tooltip.style.fontSize = '13px';
    tooltip.style.lineHeight = '1.35';
    tooltip.style.display = 'none';
    tooltip.textContent = 'Falls du Hilfe brauchst, bin ich hier.';

    // Widget panel
    var panel = document.createElement('div');
    panel.style.width = '360px';
    panel.style.height = '600px';
    panel.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    panel.style.borderRadius = '12px';
    panel.style.overflow = 'hidden';
    panel.style.background = '#fff';
    panel.style.display = 'none';

    // Close button overlay
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Chat schließen');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.right = '10px';
    closeBtn.style.bottom = '610px';
    closeBtn.style.width = '28px';
    closeBtn.style.height = '28px';
    closeBtn.style.borderRadius = '999px';
    closeBtn.style.border = '1px solid rgba(0,0,0,0.12)';
    closeBtn.style.background = 'rgba(255,255,255,0.95)';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.display = 'none';

    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.src = baseUrl + '/widget?chatbotId=' + encodeURIComponent(cfg.chatbotId);
    iframe.title = 'ChatBot Widget';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.setAttribute('referrerpolicy', 'origin');
    // Allow microphone access for voice conversation mode
    iframe.setAttribute('allow', 'microphone');
    // Allow user-initiated navigation/popups from inside the widget (e.g. clicking sources).
    // Note: sandbox attribute is removed to allow microphone access - the widget is same-origin so this is safe.
    // If cross-origin embedding is needed, use: 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-downloads'

    panel.appendChild(iframe);
    container.appendChild(panel);
    container.appendChild(closeBtn);
    container.appendChild(tooltip);
    container.appendChild(button);
    document.body.appendChild(container);

    var isOpen = false;
    var open = function () {
      isOpen = true;
      panel.style.display = 'block';
      closeBtn.style.display = 'block';
      button.style.display = 'none';
      tooltip.style.display = 'none';
    };
    var close = function () {
      isOpen = false;
      panel.style.display = 'none';
      closeBtn.style.display = 'none';
      button.style.display = 'flex';
    };

    button.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    // Show tooltip once if user hasn't opened the chat yet
    var tooltipShown = false;
    var tooltipTimer = setTimeout(function () {
      if (isOpen || tooltipShown) return;
      tooltipShown = true;
      tooltip.style.display = 'block';
      setTimeout(function () {
        tooltip.style.display = 'none';
      }, 6500);
    }, 4000);

    // Cancel tooltip timer when chat is opened
    button.addEventListener('click', function () {
      clearTimeout(tooltipTimer);
      tooltipShown = true;
    });

    // Cleanup timer on unload
    window.addEventListener('beforeunload', function () {
      try { clearTimeout(tooltipTimer); } catch (_) {}
    });
  } catch (e) {
    console.error('[ChatBot] Failed to load widget:', e);
  }
})();
