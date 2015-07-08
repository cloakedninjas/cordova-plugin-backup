package com.cloakedninjas.cordova.plugins;

import android.app.backup.BackupDataInput;
import android.app.backup.BackupDataOutput;
import android.app.backup.FileBackupHelper;
import android.os.ParcelFileDescriptor;

import java.io.IOException;

public class BackupAgentHelper extends android.app.backup.BackupAgentHelper {
    static final String FILE_NAME = "gameData.json";
    static final Object sDataLock = new Object();

    @Override
    public void onCreate() {
        addHelper("data_file", new FileBackupHelper(this, BackupAgentHelper.FILE_NAME));
    }

    @Override
    public void onBackup(ParcelFileDescriptor oldState, BackupDataOutput data,
                         ParcelFileDescriptor newState) throws IOException {

        synchronized (BackupAgentHelper.sDataLock) {
            super.onBackup(oldState, data, newState);
        }
    }

    @Override
    public void onRestore(BackupDataInput data, int appVersionCode,
                          ParcelFileDescriptor newState) throws IOException {

        synchronized (BackupAgentHelper.sDataLock) {
            super.onRestore(data, appVersionCode, newState);
        }
    }
}
