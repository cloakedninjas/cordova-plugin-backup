var backup = {
  save: function(data, success, fail) {
    cordova.exec(success, fail, 'Backup', 'saveBackup', [data]);
  },

  restore: function(success, fail) {
    cordova.exec(success, fail, 'Backup', 'checkForRestore', []);
  }
};

if (window) {
  if (!window.plugins) {
    window.plugins = {};
  }
  if (!window.plugins.backup) {
    window.plugins.backup = backup;
  }
}

module.exports = backup;
