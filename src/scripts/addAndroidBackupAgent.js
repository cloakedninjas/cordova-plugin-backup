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

    manifestObject,
    backupServiceKey;

  fs.readFile(manifestLocation, function (err, data) {
    parser.parseString(data, function (err, result) {
      manifestObject = result;

      if (readyToModify()) {
        modifyXmlValues();
      }
    });
  });

  fs.readFile(backupServiceKeyLocation, function (err, data) {
    parser.parseString(data, function (err, result) {
      if (result && result.resources && result.resources.string && result.resources.string.length === 1 && result.resources.string[0]._) {
        backupServiceKey = result.resources.string[0]._;

        if (readyToModify()) {
          modifyXmlValues();
        }
      }
      else {
        deferral.reject(new Error('Unable to extract the Backup Service API key from: ' + backupServiceKeyLocation));
      }
    });
  });

  function readyToModify() {
    return manifestObject !== undefined && backupServiceKey !== undefined;
  }

  function modifyXmlValues() {
    // set the API key
    var applicationSection = manifestObject.manifest.application[0],
      apiKeyValue = {
        $: {
          'android:name': 'com.google.android.backup.api_key',
          'android:value': backupServiceKey,
        }
      };

    // add the BackupAgent attribute
    applicationSection.$['android:backupAgent'] = 'com.cloakedninjas.cordova.plugins.BackupAgentHelper';
    applicationSection.$['android:allowBackup'] = 'true';

    if (applicationSection['meta-data']) {
      var addMetaDataEntry = true;

      for (var i = 0; i < applicationSection['meta-data'].length; i++) {
        var metaDataEntry = applicationSection['meta-data'][i];

        if (metaDataEntry.$ && metaDataEntry.$['android:name'] && metaDataEntry.$['android:name'] === 'com.google.android.backup.api_key') {
          addMetaDataEntry = false;
          break;
        }
      }

      if (addMetaDataEntry) {
        applicationSection['meta-data'].push(apiKeyValue);
      }
    }
    else {
      // no meta-data elements exist, create the first
      applicationSection['meta-data'] = [apiKeyValue];
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
