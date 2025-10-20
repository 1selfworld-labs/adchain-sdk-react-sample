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

class AdchainOfferwallViewManager : SimpleViewManager<AdchainOfferwallView>() {

    companion object {
        private const val TAG = "OfferwallViewManager"
        private const val REACT_CLASS = "AdchainOfferwallView"
        private const val COMMAND_LOAD_OFFERWALL = 1
        private const val COMMAND_HANDLE_BACK_PRESS = 2
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
            "handleBackPress" to COMMAND_HANDLE_BACK_PRESS
        )
    }

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
            "onHeightChange" to mapOf("registrationName" to "onHeightChange")
        )
    }
}
