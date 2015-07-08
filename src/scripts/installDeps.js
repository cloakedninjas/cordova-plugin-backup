#!/usr/bin/env node

'use strict';

module.exports = function (context) {

  console.log('Installing node dependencies...');

  var shell = context.requireCordovaModule('shelljs');

  shell.cd(context.opts.plugin.dir);
  shell.exec('npm install');

};