package com.cloakedninjas.cordova.plugins;

import android.app.backup.BackupDataInput;
import android.app.backup.BackupDataOutput;
import android.app.backup.FileBackupHelper;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import java.io.IOException;

public class BackupAgentHelper extends android.app.backup.BackupAgentHelper {
    static final String FILE_NAME = "gameData.json";
    static final String FILES_BACKUP_KEY = "data_file";

    @Override
    public void onCreate() {
        FileBackupHelper helper = new FileBackupHelper(this, FILE_NAME);
        addHelper(FILES_BACKUP_KEY, helper);
    }

    @Override
    public void onBackup(ParcelFileDescriptor oldState, BackupDataOutput data,
                         ParcelFileDescriptor newState) throws IOException {

        synchronized (Backup.sDataLock) {
            Log.d(Backup.LOG_TAG, "Backup requested: " + data.toString());
            super.onBackup(oldState, data, newState);
        }
    }

    @Override
    public void onRestore(BackupDataInput data, int appVersionCode,
                          ParcelFileDescriptor newState) throws IOException {

        synchronized (Backup.sDataLock) {
            Log.d(Backup.LOG_TAG, "Restore given: " + data.toString());
            super.onRestore(data, appVersionCode, newState);
        }
    }
}
