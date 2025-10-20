package com.treasurerrn

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.adchain.sdk.core.AdchainSdk
import com.adchain.sdk.offerwall.AdchainOfferwallView
import com.adchain.sdk.offerwall.OfferwallCallback
import com.adchain.sdk.offerwall.OfferwallEventCallback

class AdchainOfferwallViewManager : SimpleViewManager<AdchainOfferwallView>() {

    companion object {
        private const val TAG = "OfferwallViewManager"
        private const val REACT_CLASS = "AdchainOfferwallView"
        private const val COMMAND_LOAD_OFFERWALL = 1
        private const val COMMAND_HANDLE_BACK_PRESS = 2
        private const val COMMAND_SEND_DATA_RESPONSE = 3  // NEW
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): AdchainOfferwallView {
        Log.d(TAG, "createViewInstance called")
        return AdchainOfferwallView(reactContext)
    }

    override fun getCommandsMap(): Map<String, Int> {
        Log.d(TAG, "getCommandsMap called")
        return mapOf(
            "loadOfferwall" to COMMAND_LOAD_OFFERWALL,
            "handleBackPress" to COMMAND_HANDLE_BACK_PRESS,
            "sendDataResponse" to COMMAND_SEND_DATA_RESPONSE  // NEW
        )
    }

    // Store pending data request responses
    private val pendingDataResponses = mutableMapOf<String, Map<String, Any?>>()

    override fun receiveCommand(
        root: AdchainOfferwallView,
        commandId: String?,
        args: ReadableArray?
    ) {
        Log.d(TAG, "receiveCommand called - commandId: $commandId, args: $args")
        when (commandId) {
            "loadOfferwall" -> {
                val placementId = args?.getString(0) ?: ""
                Log.d(TAG, "loadOfferwall command - placementId: $placementId")
                loadOfferwall(root, placementId)
            }
            "handleBackPress" -> {
                Log.d(TAG, "handleBackPress command")
                val handled = root.handleBackPress()
                Log.d(TAG, "handleBackPress result: $handled")
            }
            "sendDataResponse" -> {  // NEW
                val requestId = args?.getString(0) ?: ""
                val responseData = args?.getMap(1)?.toHashMap()
                Log.d(TAG, "sendDataResponse command - requestId: $requestId, data: $responseData")
                if (responseData != null) {
                    pendingDataResponses[requestId] = responseData
                }
            }
            else -> {
                Log.w(TAG, "Unknown command: $commandId")
            }
        }
    }

    private fun loadOfferwall(view: AdchainOfferwallView, placementId: String) {
        Log.d(TAG, "loadOfferwall method called - placementId: $placementId")

        if (placementId.isEmpty()) {
            Log.w(TAG, "placementId is empty, returning")
            return
        }

        try {
            // Get SDK config, user, and offerwall URL
            val config = AdchainSdk.getConfig()
            val user = AdchainSdk.getCurrentUser()
            val offerwallUrl = AdchainSdk.getOfferwallUrl()

            Log.d(TAG, "SDK state - config: ${config != null}, user: ${user != null}, url: $offerwallUrl")

            if (config == null) {
                Log.e(TAG, "SDK not initialized")
                sendErrorEvent(view, "SDK not initialized")
                return
            }

            if (user == null) {
                Log.e(TAG, "User not logged in")
                sendErrorEvent(view, "User not logged in")
                return
            }

            if (offerwallUrl.isNullOrEmpty()) {
                Log.e(TAG, "Offerwall URL not available")
                sendErrorEvent(view, "Offerwall URL not available")
                return
            }

            Log.d(TAG, "About to call view.loadOfferwall()")
            Log.d(TAG, "Parameters - baseUrl: $offerwallUrl, userId: ${user.userId}, appKey: ${config.appKey}, placementId: $placementId")

            // Set callback for offerwall events
            Log.d(TAG, "Setting callback...")
            view.setCallback(object : OfferwallCallback {
                override fun onOpened() {
                    sendEvent(view, "onOfferwallOpened", Arguments.createMap())
                }

                override fun onClosed() {
                    sendEvent(view, "onOfferwallClosed", Arguments.createMap())
                }

                override fun onError(message: String) {
                    val map = Arguments.createMap().apply {
                        putString("error", message)
                    }
                    sendEvent(view, "onOfferwallError", map)
                }

                override fun onRewardEarned(amount: Int) {
                    val map = Arguments.createMap().apply {
                        putInt("amount", amount)
                    }
                    sendEvent(view, "onRewardEarned", map)
                }

                override fun onHeightChanged(height: Int) {
                    Log.d(TAG, "onHeightChanged callback received - height: $height")
                    val map = Arguments.createMap().apply {
                        putInt("height", height)
                    }
                    sendEvent(view, "onHeightChange", map)
                }
            })

            // NEW: Set event callback for custom events
            Log.d(TAG, "Setting event callback...")
            view.setEventCallback(object : OfferwallEventCallback {
                override fun onCustomEvent(eventType: String, payload: Map<String, Any?>) {
                    Log.d(TAG, "onCustomEvent received - type: $eventType, payload: $payload")

                    // Show Toast for testing
                    android.os.Handler(android.os.Looper.getMainLooper()).post {
                        val message = when (eventType) {
                            "show_toast" -> payload["message"]?.toString() ?: "Unknown message"
                            else -> "Event: $eventType\n${payload.entries.joinToString("\n") { "${it.key}: ${it.value}" }}"
                        }
                        android.widget.Toast.makeText(
                            view.context,
                            message,
                            android.widget.Toast.LENGTH_LONG
                        ).show()
                    }

                    val map = Arguments.createMap().apply {
                        putString("eventType", eventType)
                        putMap("payload", convertMapToWritableMap(payload))
                    }
                    sendEvent(view, "onCustomEvent", map)
                }

                override fun onDataRequest(
                    requestId: String,
                    requestType: String,
                    params: Map<String, Any?>
                ): Map<String, Any?>? {
                    Log.d(TAG, "onDataRequest received - id: $requestId, type: $requestType, params: $params")

                    // Send event to React Native
                    val map = Arguments.createMap().apply {
                        putString("requestId", requestId)
                        putString("requestType", requestType)
                        putMap("params", convertMapToWritableMap(params))
                    }
                    sendEvent(view, "onDataRequest", map)

                    // Wait for response from React Native (with timeout)
                    val startTime = System.currentTimeMillis()
                    val timeout = 5000L // 5 seconds

                    while (System.currentTimeMillis() - startTime < timeout) {
                        val response = pendingDataResponses.remove(requestId)
                        if (response != null) {
                            Log.d(TAG, "Data response received for request: $requestId")
                            return response
                        }
                        Thread.sleep(10)
                    }

                    Log.w(TAG, "Data request timeout: $requestId")
                    return null
                }
            })

            // Load offerwall
            Log.d(TAG, "Calling view.loadOfferwall()...")
            view.loadOfferwall(
                baseUrl = offerwallUrl,
                userId = user.userId,
                appKey = config.appKey,
                placementId = placementId
            )
            Log.d(TAG, "view.loadOfferwall() call completed")

        } catch (e: Exception) {
            Log.e(TAG, "Exception in loadOfferwall", e)
            e.printStackTrace()
            sendErrorEvent(view, "Failed to load offerwall: ${e.message}")
        }
    }

    private fun sendEvent(view: AdchainOfferwallView, eventName: String, params: WritableMap) {
        val reactContext = view.context as ReactContext
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private fun sendErrorEvent(view: AdchainOfferwallView, error: String) {
        val map = Arguments.createMap().apply {
            putString("error", error)
        }
        sendEvent(view, "onOfferwallError", map)
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
        return mapOf(
            "onOfferwallOpened" to mapOf("registrationName" to "onOfferwallOpened"),
            "onOfferwallClosed" to mapOf("registrationName" to "onOfferwallClosed"),
            "onOfferwallError" to mapOf("registrationName" to "onOfferwallError"),
            "onRewardEarned" to mapOf("registrationName" to "onRewardEarned"),
            "onHeightChange" to mapOf("registrationName" to "onHeightChange"),
            "onCustomEvent" to mapOf("registrationName" to "onCustomEvent"),  // NEW
            "onDataRequest" to mapOf("registrationName" to "onDataRequest")   // NEW
        )
    }

    // Helper function to convert Map to WritableMap
    private fun convertMapToWritableMap(map: Map<String, Any?>): WritableMap {
        val writableMap = Arguments.createMap()
        map.forEach { (key, value) ->
            when (value) {
                null -> writableMap.putNull(key)
                is String -> writableMap.putString(key, value)
                is Int -> writableMap.putInt(key, value)
                is Double -> writableMap.putDouble(key, value)
                is Boolean -> writableMap.putBoolean(key, value)
                is Map<*, *> -> {
                    @Suppress("UNCHECKED_CAST")
                    writableMap.putMap(key, convertMapToWritableMap(value as Map<String, Any?>))
                }
                is List<*> -> {
                    writableMap.putArray(key, convertListToWritableArray(value))
                }
                else -> Log.w(TAG, "Unsupported value type for key: $key")
            }
        }
        return writableMap
    }

    private fun convertListToWritableArray(list: List<*>): com.facebook.react.bridge.WritableArray {
        val writableArray = Arguments.createArray()
        list.forEach { item ->
            when (item) {
                null -> writableArray.pushNull()
                is String -> writableArray.pushString(item)
                is Int -> writableArray.pushInt(item)
                is Double -> writableArray.pushDouble(item)
                is Boolean -> writableArray.pushBoolean(item)
                is Map<*, *> -> {
                    @Suppress("UNCHECKED_CAST")
                    writableArray.pushMap(convertMapToWritableMap(item as Map<String, Any?>))
                }
                is List<*> -> {
                    writableArray.pushArray(convertListToWritableArray(item))
                }
                else -> Log.w(TAG, "Unsupported item type in list")
            }
        }
        return writableArray
    }
}
