(() => {
  'use strict';

  const dialog = document.getElementById('feedback-dialog');
  const form = document.getElementById('feedback-form');
  const status = document.getElementById('feedback-status');
  const close = document.getElementById('feedback-close');
  const controls = Array.from(form.elements);
  let sending = false;
  let previous;

  document.querySelectorAll('[data-feedback-open]').forEach(button => {
    button.addEventListener('click', () => {
      status.textContent = '';
      dialog.showModal();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', event => {
    if (sending) event.preventDefault();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;

    const fields = new FormData(form);
    const details = {
      category: fields.get('category'),
      message: fields.get('message').trim(),
      senderName: fields.get('senderName').trim(),
    };
    if (details.message.length < 5) {
      status.textContent = 'Please write at least five characters.';
      form.elements.message.focus();
      return;
    }

    const key = JSON.stringify(details);
    if (previous?.key !== key) previous = { key, id: crypto.randomUUID() };

    sending = true;
    controls.forEach(control => { control.disabled = true; });
    status.textContent = 'Sending…';
    try {
      const response = await window.PintShared.sendFeedback({ id: previous.id, ...details });
      if (response.sent !== true) throw new Error('Missing feedback receipt');
      previous = undefined;
      form.reset();
      status.textContent = 'Thanks. Your feedback was sent.';
    } catch (error) {
      status.textContent = error.message?.startsWith('Daily feedback limit')
        ? error.message
        : 'We couldn’t confirm it was sent. Your message is still here. Please try again.';
    } finally {
      sending = false;
      controls.forEach(control => { control.disabled = false; });
    }
  });
})();
