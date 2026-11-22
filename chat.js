try {
  const { createChat } = await import('https://cdn.jsdelivr.net/npm/@n8n/chat@1.46.5/dist/chat.bundle.es.js');

  createChat({
    webhookUrl: 'https://agenticflows.tokencraze.org/webhook/8e02bf4d-17af-4cb5-9f5c-7656b70efe9d/chat',
    mode: 'window',
    loadPreviousSession: false,
    initialMessages: [
      'Hello! Welcome to the JS-SEZ advisor.',
      'What would you like to know about the playbook?'
    ],
    i18n: {
      en: {
        title: 'JS-SEZ advisor',
        subtitle: 'Ask a question about the playbook.',
        footer: '',
        getStarted: 'New conversation',
        inputPlaceholder: 'Type your question…'
      }
    }
  });

  await new Promise((resolve, reject) => {
    const target = document.getElementById('n8n-chat');
    let timer;
    const observer = new MutationObserver(checkReady);
    function checkReady() {
      if (target.querySelector('.chat-window-toggle') && target.querySelector('.chat-input-send-button')) {
        observer.disconnect();
        clearTimeout(timer);
        resolve();
      }
    }
    observer.observe(target, { childList: true, subtree: true });
    timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error('The chat widget did not initialise in time.'));
    }, 10000);
    checkReady();
  });

  const toggle = document.querySelector('.chat-window-toggle');
  const windowElement = document.querySelector('.chat-window');
  const input = document.querySelector('.chat-input textarea');
  const sendButton = document.querySelector('.chat-input-send-button');

  if (!toggle || !windowElement || !input || !sendButton) {
    throw new Error('The chat widget did not initialise as expected.');
  }

  windowElement.id = 'advisor-chat-window';
  toggle.setAttribute('role', 'button');
  toggle.setAttribute('tabindex', '0');
  toggle.setAttribute('aria-label', 'Open or close JS-SEZ advisor');
  toggle.setAttribute('aria-controls', windowElement.id);
  input.setAttribute('aria-label', 'Your question');
  sendButton.setAttribute('aria-label', 'Send question');

  const updateExpanded = () => {
    toggle.setAttribute('aria-expanded', String(windowElement.style.display !== 'none'));
  };
  new MutationObserver(updateExpanded).observe(windowElement, { attributes: true, attributeFilter: ['style'] });
  updateExpanded();
  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle.click();
    }
  });
} catch (error) {
  console.error('Unable to load the JS-SEZ advisor:', error);
  document.getElementById('chat-error').hidden = false;
}
