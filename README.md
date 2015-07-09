# Cordova Backup Plugin

## Summary

This plugin makes use of [Android's Data Backup service](http://developer.android.com/guide/topics/data/backup.html) to backup and restore app data. Currently only Android is supported.

## Installation

### Install the plugin

```sh
cordova plugin add cordova-plugin-backup --variable BACKUP_SERVICE_KEY="<API_KEY>"
```

If you've not yet registered to use Google Data Backup, [get a key here](https://developer.android.com/google/backup/signup.html?csw=1)

### Supported platforms

 - **Android** version 2.2 (API level 8) or higher

## Getting Started

A typical lifecycle is as follows:
 - User installs your app for the first time
 - App starts, sees it has no existing data, makes a request to restore backup
 - No data is found, your app creates stub data
 - Users uses your app, generates data: Your app requests a backup
 - Further use, further backups...
 - User downloads your app onto a new device
 - App starts, sees it has no existing data, makes a request to restore backup
 - Data is found, restored and returned to your app
 - User continues where they left off

## API

### Backup

```javascript
var appData = {
  user: {
    id: 1678,
    name: 'Fred',

    preferences: {
      mute: true,
      locale: 'en_GB'
    }
  }
}

plugins.backup.create(appData);
```

### Restore

```javascript
function handleRestore (data) {
  if (data) {
    appData = data;
  }
  else {
    // initialize first-use data
  }
}

plugins.backup.restore(handleRestore);
```

## Licence

The MIT License

Copyright (c) 2015, Daniel Jackson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
