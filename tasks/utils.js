import log from 'fancy-log';

export const onError = function(err) {
  log.error('[ERROR]\n', err.message);
  this.emit('end');
};
