Hooks.once('init', () => {
  console.log('StarMessage | Initialized');
});

Hooks.on('renderChatMessage', (message, html, data) => {
  const pinned = message.getFlag('star-message', 'pinned');
  const icon = $(`<a class="star-message-pin" title="Protect Message"><i class="${pinned ? 'fa-solid' : 'fa-regular'} fa-star"></i></a>`);
  html.find('header').prepend(icon);
  icon.on('click', async ev => {
    ev.preventDefault();
    const newState = !message.getFlag('star-message', 'pinned');
    await message.update({ ['flags.star-message.pinned']: newState });
  });
});

Hooks.on('preDeleteChatMessage', message => {
  if (message.getFlag('star-message', 'pinned')) return false;
});