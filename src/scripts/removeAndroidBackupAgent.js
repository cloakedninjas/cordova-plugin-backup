#!/usr/bin/env node

'use strict';

module.exports = function (context) {
  var Q = context.requireCordovaModule('q'),
    deferral = new Q.defer(),
    fs = context.requireCordovaModule('fs'),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser();

  var manifestLocation = context.opts.projectRoot + '/platforms/android/AndroidManifest.xml',
    backupServiceKeyLocation = context.opts.projectRoot + '/platforms/android/res/values/backup_service_key_param.xml',
    manifestObject;

  fs.unlink(backupServiceKeyLocation, readyToModify);

  fs.readFile(manifestLocation, function (err, data) {
    parser.parseString(data, function (err, result) {
      manifestObject = result;

      if (readyToModify()) {
        modifyXmlValues();
      }
    });
  });

  function readyToModify() {
    return manifestObject !== undefined;
  }

  function modifyXmlValues() {
    var applicationSection = manifestObject.manifest.application[0];

    // remove the BackupAgent attribute
    delete applicationSection.$['android:backupAgent'];
    delete applicationSection.$['android:allowBackup'];

    // remove API key from meta-data
    if (applicationSection['meta-data']) {
      for (var i = 0; i < applicationSection['meta-data'].length; i++) {
        var metaDataEntry = applicationSection['meta-data'][i];

        if (metaDataEntry.$ && metaDataEntry.$['android:name'] && metaDataEntry.$['android:name'] === 'com.google.android.backup.api_key') {
          applicationSection['meta-data'].splice(i, 1);
          break;
        }
      }
    }

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(manifestObject);

    fs.writeFile(manifestLocation, xml, function (err) {
      if (err) {
        deferral.reject(new Error('Unable to write XML to: ' + manifestLocation));
      }

      deferral.resolve();
    });
  }

  return deferral.promise;

};
