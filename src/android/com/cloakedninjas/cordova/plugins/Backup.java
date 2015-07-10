package com.cloakedninjas.cordova.plugins;

import android.app.backup.BackupManager;
import android.content.Context;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class Backup extends CordovaPlugin {

    static final String LOG_TAG = "CordovaBackupPlugin";
    static final Object sDataLock = new Object();

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Log.d(LOG_TAG, "JS call: " + action);
        if (action.equals("saveBackup")) {
            JSONObject data = args.getJSONObject(0);
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, saveBackup(data)));
            return true;
        }
        else if (action.equals("checkForRestore")) {
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, checkForRestore()));
            return true;
        }

        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
        return false;
    }

    private boolean saveBackup(JSONObject data) {
        BufferedWriter writer = null;
        try {
            Context context = cordova.getActivity().getApplicationContext();
            File file = new File(context.getFilesDir(), BackupAgentHelper.FILE_NAME);
            writer = new BufferedWriter(new FileWriter(file));
            writer.write(data.toString());

            // request a backup from Android system
            Log.d(LOG_TAG, "Requesting Backup");
            BackupManager bm = new BackupManager(context);
            bm.dataChanged();
        } catch (IOException e) {
            Log.e(LOG_TAG, e.getMessage());
        } finally {
            try {
                if (writer != null) {
                    writer.close();
                }
            } catch (IOException e) {
                Log.e(LOG_TAG, "Failed to save backup" + e.getMessage());
            }
        }

        return true;
    }

    private JSONObject checkForRestore() {
        BufferedReader reader = null;

        try {
            Context context = cordova.getActivity().getApplicationContext();
            File file = new File(context.getFilesDir(), BackupAgentHelper.FILE_NAME);

            if (file.exists() && !file.isDirectory()) {
                reader = new BufferedReader(new FileReader(file));
                StringBuilder sb = new StringBuilder();
                String line = reader.readLine();

                while (line != null) {
                    sb.append(line);
                    line = reader.readLine();
                }
                String fileContents = sb.toString();

                return new JSONObject(fileContents);
            }
        } catch (IOException e) {
            Log.e(LOG_TAG, "Failed to open backup file" + e.getMessage());
        } catch (JSONException e) {
            Log.e(LOG_TAG, "Failed to parse JSON" + e.getMessage());
        } finally {
            try {
                if (reader != null) {
                    reader.close();
                }
            } catch (IOException e) {
                Log.e(LOG_TAG, e.getMessage());
            }
        }

        return new JSONObject();
    }
}
