var Backup = function() {};

Backup.prototype.save = function(success, fail) {
  cordova.exec(success, fail, 'Backup', 'saveBackup', []);
};

Backup.prototype.restore = function(success, fail) {
  cordova.exec(success, fail, 'Backup', 'checkForRestore', []);
};

if (!window.plugins) {
  window.plugins = {};
}
if (!window.plugins.backup) {
  window.plugins.backup = new Backup();
}

if (module.exports) {
  module.exports = Backup;
}
