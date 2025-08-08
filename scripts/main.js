Hooks.once('init', () => {
  console.log('StarMessage | Initialized');
  game.settings.register('star-message', 'protectionMethod', {
    name: 'Protection Method',
    hint: 'Choose how to protect chat messages',
    scope: 'client',
    config: true,
    type: String,
    choices: {
      star: 'Star Icon',
      context: 'Context Menu',
      both: 'Both'
    },
    default: 'star',
    onChange: () => window.location.reload()
  });
});

Hooks.on('renderChatMessage', (message, html, data) => {
  const pinned = message.getFlag('star-message', 'pinned');
  const method = game.settings.get('star-message', 'protectionMethod');

  if (pinned) html.addClass('star-message-protected');

  if (method === 'star' || method === 'both') {
    const icon = $(`<a class="star-message-pin" title="${pinned ? 'Unprotect Message' : 'Protect Message'}"><i class="${pinned ? 'fa-solid' : 'fa-regular'} fa-star"></i></a>`);
    html.find('.message-sender').after(icon);
    icon.on('click', async ev => {
      ev.preventDefault();
      const newState = !message.getFlag('star-message', 'pinned');
      await message.update({ ['flags.star-message.pinned']: newState });
    });
  }
});

Hooks.on('getChatLogEntryContext', (html, options) => {
  const method = game.settings.get('star-message', 'protectionMethod');
  if (method === 'context' || method === 'both') {
    options.push({
      name: 'Protect Message',
      icon: '<i class="fa-solid fa-star"></i>',
      condition: li => {
        const message = game.messages.get(li.data('messageId'));
        return !message.getFlag('star-message', 'pinned');
      },
      callback: li => {
        const message = game.messages.get(li.data('messageId'));
        message.update({ ['flags.star-message.pinned']: true });
      }
    });
    options.push({
      name: 'Unprotect Message',
      icon: '<i class="fa-regular fa-star"></i>',
      condition: li => {
        const message = game.messages.get(li.data('messageId'));
        return message.getFlag('star-message', 'pinned');
      },
      callback: li => {
        const message = game.messages.get(li.data('messageId'));
        message.update({ ['flags.star-message.pinned']: false });
      }
    });
  }
});

Hooks.on('preDeleteChatMessage', message => {
  if (message.getFlag('star-message', 'pinned')) return false;
});
