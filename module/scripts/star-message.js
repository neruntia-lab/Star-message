Hooks.on("renderChatMessage", (message, html, data) => {
  const flagged = message.getFlag("star-message", "starred");
  const star = $(`<a class='star-flag'><i class='far fa-star'></i></a>`);
  if (flagged) star.find('i').removeClass('far').addClass('fas text-yellow');
  star.on('click', async ev => {
    ev.preventDefault();
    const flagged = !message.getFlag("star-message", "starred");
    await message.setFlag("star-message", "starred", flagged);
    star.find('i').toggleClass('fas text-yellow', flagged);
    star.find('i').toggleClass('far', !flagged);
  });
  html.find('.message-content').prepend(star);
  html.addClass('star-message-container');
});

Hooks.on("preDeleteChatMessage", (message, options, userId) => {
  if (message.getFlag("star-message", "starred")) return false;
  return true;
});
