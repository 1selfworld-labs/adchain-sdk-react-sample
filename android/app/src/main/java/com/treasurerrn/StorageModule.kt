package com.treasurerrn

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = StorageModule.NAME)
class StorageModule(private val reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "Storage"
  }

  override fun getName() = NAME

  @ReactMethod
  fun setItem(key: String, value: String, promise: Promise) {
    try {
      val sharedPref = reactContext.getSharedPreferences("AdchainLoginData", android.content.Context.MODE_PRIVATE)
      with(sharedPref.edit()) {
        putString(key, value)
        apply()
      }
      promise.resolve(true)
    } catch (t: Throwable) {
      promise.reject("STORAGE_ERROR", t.message, t)
    }
  }

  @ReactMethod
  fun getItem(key: String, promise: Promise) {
    try {
      val sharedPref = reactContext.getSharedPreferences("AdchainLoginData", android.content.Context.MODE_PRIVATE)
      val value = sharedPref.getString(key, null)
      promise.resolve(value)
    } catch (t: Throwable) {
      promise.reject("STORAGE_ERROR", t.message, t)
    }
  }
}