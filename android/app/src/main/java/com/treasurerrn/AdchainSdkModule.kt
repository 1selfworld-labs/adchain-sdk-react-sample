package com.treasurerrn

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.adchain.sdk.core.*
import com.adchain.sdk.quiz.*
import com.adchain.sdk.quiz.models.QuizEvent
import com.adchain.sdk.mission.*
import com.adchain.sdk.offerwall.*
import android.app.Activity

@ReactModule(name = AdchainSdkModule.NAME)
class AdchainSdkModule(private val reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext) {

  companion object { 
    const val NAME = "AdchainSdk"
  }
  
  override fun getName() = NAME
  
  // 내부 인스턴스 관리 (자동 생성/캐싱)
  private val quizInstances = mutableMapOf<String, AdchainQuiz>()
  private val missionInstances = mutableMapOf<String, AdchainMission>()

  // ===== 1. SDK 초기화 =====
  
  @ReactMethod
  fun initialize(appKey: String, appSecret: String, options: ReadableMap?, promise: Promise) {
    try {
      // options에서 environment와 timeout 추출
      val environment = options?.getString("environment")
      val timeout = if (options?.hasKey("timeout") == true && !options.isNull("timeout")) {
        options.getDouble("timeout")
      } else null
      
      val env = when(environment?.uppercase()) {
        "STAGING" -> AdchainSdkConfig.Environment.STAGING
        "DEVELOPMENT" -> AdchainSdkConfig.Environment.DEVELOPMENT
        else -> AdchainSdkConfig.Environment.PRODUCTION
      }
      
      val configBuilder = AdchainSdkConfig.Builder(appKey, appSecret)
        .setEnvironment(env)
      
      timeout?.let {
        configBuilder.setTimeout(it.toLong())
      }
      
      val config = configBuilder.build()
      
      currentActivity?.let { activity ->
        AdchainSdk.initialize(activity.application, config)
        promise.resolve(createResponse(true, "SDK initialized successfully"))
      } ?: promise.reject("INIT_ERROR", "Current activity is null")
      
    } catch (t: Throwable) {
      promise.reject("INIT_ERROR", t.message, t)
    }
  }

  // ===== 2. 인증 관련 (4개) =====
  
  @ReactMethod
  fun login(userId: String, userInfo: ReadableMap?, promise: Promise) {
    try {
      val userBuilder = AdchainSdkUser.Builder(userId)
      
      // userInfo에서 각 필드 추출
      val gender = userInfo?.getString("gender")
      val birthYear = if (userInfo?.hasKey("birthYear") == true && !userInfo.isNull("birthYear")) {
        userInfo.getDouble("birthYear").toInt()
      } else null
      
      gender?.let {
        val genderEnum = when(it.uppercase()) {
          "MALE", "M" -> AdchainSdkUser.Gender.MALE
          "FEMALE", "F" -> AdchainSdkUser.Gender.FEMALE
          else -> null // Android SDK에 OTHER가 없음
        }
        genderEnum?.let { g ->
          userBuilder.setGender(g)
        }
      }
      
      birthYear?.let {
        userBuilder.setBirthYear(it)
      }
      
      // customProperties 처리
      val customProperties = userInfo?.getMap("customProperties")
      customProperties?.let { props ->
        val iterator = props.keySetIterator()
        while (iterator.hasNextKey()) {
          val key = iterator.nextKey()
          val value = props.getString(key)
          if (value != null) {
            userBuilder.setCustomProperty(key, value)
          }
        }
      }
      
      val user = userBuilder.build()
      
      AdchainSdk.login(user, object : AdchainSdkLoginListener {
        override fun onSuccess() {
          promise.resolve(createResponse(true, "Login successful"))
        }
        
        override fun onFailure(errorType: AdchainSdkLoginListener.ErrorType) {
          val errorMessage = when (errorType) {
            AdchainSdkLoginListener.ErrorType.NOT_INITIALIZED -> "SDK not initialized"
            AdchainSdkLoginListener.ErrorType.INVALID_USER_ID -> "Invalid user ID"
            AdchainSdkLoginListener.ErrorType.AUTHENTICATION_FAILED -> "Authentication failed"
            AdchainSdkLoginListener.ErrorType.NETWORK_ERROR -> "Network error"
            AdchainSdkLoginListener.ErrorType.UNKNOWN -> "Unknown error"
          }
          promise.reject("LOGIN_ERROR", errorMessage)
        }
      })
    } catch (t: Throwable) {
      promise.reject("LOGIN_ERROR", t.message, t)
    }
  }
  
  @ReactMethod
  fun logout(promise: Promise) {
    try {
      AdchainSdk.logout()
      promise.resolve(createResponse(true, "Logout successful"))
    } catch (t: Throwable) {
      promise.reject("LOGOUT_ERROR", t.message, t)
    }
  }
  
  @ReactMethod
  fun isLoggedIn(promise: Promise) {
    try {
      promise.resolve(AdchainSdk.isLoggedIn)
    } catch (t: Throwable) {
      promise.reject("ERROR", t.message, t)
    }
  }
  
  @ReactMethod
  fun getCurrentUser(promise: Promise) {
    try {
      val user = AdchainSdk.getCurrentUser()
      if (user != null) {
        val map = Arguments.createMap().apply {
          putString("userId", user.userId)
          user.gender?.let { putString("gender", it.name) }
          user.birthYear?.let { putInt("birthYear", it) }
        }
        promise.resolve(map)
      } else {
        promise.resolve(null)
      }
    } catch (t: Throwable) {
      promise.reject("ERROR", t.message, t)
    }
  }

  // ===== 3. Quiz 관련 (2개) =====
  
  @ReactMethod
  fun loadQuizList(unitId: String, promise: Promise) {
    try {
      // 인스턴스 자동 생성/재사용
      val quiz = quizInstances.getOrPut(unitId) { 
        AdchainQuiz(unitId) 
      }
      
      quiz.getQuizList(
        onSuccess = { quizList ->
          val array = Arguments.createArray()
          quizList.forEach { quizEvent ->
            val map = Arguments.createMap().apply {
              putString("id", quizEvent.id)
              putString("title", quizEvent.title)
              putString("description", quizEvent.description ?: "")
              putString("imageUrl", quizEvent.imageUrl)
              putString("point", quizEvent.point) // 원본 문자열 그대로 전달
              putBoolean("isCompleted", quizEvent.completed ?: false)
            }
            array.pushMap(map)
          }
          promise.resolve(array)
        },
        onFailure = { error ->
          promise.reject("QUIZ_LOAD_ERROR", error.toString())
        },
        shouldStoreCallbacks = true // 콜백 저장하여 자동 refresh 가능하게 함
      )
    } catch (t: Throwable) {
      promise.reject("QUIZ_ERROR", t.message, t)
    }
  }
  
  @ReactMethod
  fun clickQuiz(unitId: String, quizId: String, promise: Promise) {
    try {
      val quiz = quizInstances.getOrPut(unitId) { 
        AdchainQuiz(unitId) 
      }
      
      // iOS와 동일한 방식: 리스너 설정
      quiz.setQuizEventsListener(object : AdchainQuizEventsListener {
        override fun onImpressed(quizEvent: QuizEvent) {
          // 필요시 처리
        }
        
        override fun onClicked(quizEvent: QuizEvent) {
          // 필요시 처리
        }
        
        override fun onQuizCompleted(quizEvent: QuizEvent, score: Int) {
          // React Native로 이벤트 전송
          reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onQuizCompleted", Arguments.createMap().apply {
              putString("unitId", unitId)
              putString("quizId", quizId)
              putDouble("timestamp", System.currentTimeMillis().toDouble())
            })
        }
      })
      
      quiz.clickQuiz(quizId)
      promise.resolve(createResponse(true, "Quiz clicked"))
    } catch (t: Throwable) {
      promise.reject("QUIZ_ERROR", t.message, t)
    }
  }

  // ===== 4. Mission 관련 (3개) =====
  
  @ReactMethod
  fun loadMissionList(unitId: String, promise: Promise) {
    try {
      // 인스턴스 자동 생성/재사용
      val mission = missionInstances.getOrPut(unitId) { 
        AdchainMission(unitId) 
      }
      
      mission.getMissionList(
        onSuccess = { missionList ->
          // getMissionStatus를 호출하여 정확한 진행 상태 가져오기
          mission.getMissionStatus(
            onSuccess = { status ->
              val array = Arguments.createArray()
              
              // 미션 목록
              missionList.forEach { m ->
                val map = Arguments.createMap().apply {
                  putString("id", m.id)
                  putString("title", m.title)
                  putString("description", m.description)
                  putString("imageUrl", m.imageUrl)
                  putString("point", m.point) // 원본 문자열 그대로 전달
                  putBoolean("isCompleted", m.status == "completed")
                  putString("type", m.type?.value ?: "normal")
                  putString("actionUrl", m.landingUrl)
                }
                array.pushMap(map)
              }
              
              val result = Arguments.createMap().apply {
                putArray("missions", array)
                putInt("completedCount", status.current) // getMissionStatus에서 가져온 값
                putInt("totalCount", status.total) // getMissionStatus에서 가져온 값
                putBoolean("canClaimReward", status.isCompleted && status.total > 0)
              }
              
              promise.resolve(result)
            },
            onFailure = { error ->
              // getMissionStatus 실패 시 기본값 사용
              val array = Arguments.createArray()
              missionList.forEach { m ->
                val map = Arguments.createMap().apply {
                  putString("id", m.id)
                  putString("title", m.title)
                  putString("description", m.description)
                  putString("imageUrl", m.imageUrl)
                  putString("point", m.point)
                  putBoolean("isCompleted", m.status == "completed")
                  putString("type", m.type?.value ?: "normal")
                  putString("actionUrl", m.landingUrl)
                }
                array.pushMap(map)
              }
              
              val completedCount = missionList.count { it.status == "completed" }
              val totalCount = missionList.size
              
              val result = Arguments.createMap().apply {
                putArray("missions", array)
                putInt("completedCount", completedCount)
                putInt("totalCount", totalCount)
                putBoolean("canClaimReward", completedCount == totalCount && totalCount > 0)
              }
              
              promise.resolve(result)
            }
          )
        },
        onFailure = { error ->
          promise.reject("MISSION_LOAD_ERROR", error.toString())
        }
      )
    } catch (t: Throwable) {
      promise.reject("MISSION_ERROR", t.message, t)
    }
  }
  
  @ReactMethod
  fun clickMission(unitId: String, missionId: String, promise: Promise) {
    try {
      val mission = missionInstances.getOrPut(unitId) { 
        AdchainMission(unitId) 
      }
      
      // iOS와 동일한 방식: 리스너 설정
      mission.setEventsListener(object : AdchainMissionEventsListener {
        override fun onImpressed(mission: Mission) {
          // 필요시 처리
        }
        
        override fun onClicked(mission: Mission) {
          // 필요시 처리
        }
        
        override fun onCompleted(mission: Mission) {
          // React Native로 이벤트 전송
          reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onMissionCompleted", Arguments.createMap().apply {
              putString("unitId", unitId)
              putString("missionId", missionId)
              putDouble("timestamp", System.currentTimeMillis().toDouble())
            })
        }

        override fun onProgressed(mission: Mission) {
          // React Native로 이벤트 전송 (missionCompleted와 동일한 구조)
          reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onMissionProgressed", Arguments.createMap().apply {
              putString("unitId", unitId)
              putString("missionId", missionId)
              putDouble("timestamp", System.currentTimeMillis().toDouble())
            })
        }
      })
      
      mission.clickMission(missionId)
      promise.resolve(createResponse(true, "Mission clicked"))
    } catch (t: Throwable) {
      promise.reject("MISSION_ERROR", t.message, t)
    }
  }
  
  @ReactMethod
  fun claimReward(unitId: String, promise: Promise) {
    try {
      val mission = missionInstances.getOrPut(unitId) { 
        AdchainMission(unitId) 
      }
      
      mission.clickGetReward()
      promise.resolve(createResponse(true, "Reward claimed"))
    } catch (t: Throwable) {
      promise.reject("MISSION_ERROR", t.message, t)
    }
  }

  // ===== 5. Debug/Utility Methods (3개) =====

  @ReactMethod
  fun isInitialized(promise: Promise) {
    try {
      promise.resolve(AdchainSdk.isInitialized())
    } catch (t: Throwable) {
      promise.reject("ERROR", t.message, t)
    }
  }

  @ReactMethod
  fun getUserId(promise: Promise) {
    try {
      val userId = AdchainSdk.getCurrentUser()?.userId ?: ""
      promise.resolve(userId)
    } catch (t: Throwable) {
      promise.reject("ERROR", t.message, t)
    }
  }

  @ReactMethod
  fun getIFA(promise: Promise) {
    try {
      val context = reactContext.applicationContext
      val ifa = com.adchain.sdk.utils.DeviceUtils.getAdvertisingIdSync(context) ?: ""
      promise.resolve(ifa)
    } catch (t: Throwable) {
      promise.reject("ERROR", t.message, t)
    }
  }

  // ===== 6. Banner (1개) =====

  @ReactMethod
  fun getBannerInfo(placementId: String, promise: Promise) {
    try {
      AdchainSdk.getBannerInfo(placementId) { result ->
        if (result.isSuccess) {
          val response = result.getOrNull()
          val map = Arguments.createMap().apply {
            putBoolean("success", response?.success ?: false)
            putString("imageUrl", response?.imageUrl)
            putString("titleText", response?.titleText)
            putString("linkType", response?.linkType)
            putString("internalLinkUrl", response?.internalLinkUrl)
            putString("externalLinkUrl", response?.externalLinkUrl)
          }
          promise.resolve(map)
        } else {
          promise.reject("BANNER_ERROR", result.exceptionOrNull()?.message)
        }
      }
    } catch (t: Throwable) {
      promise.reject("BANNER_ERROR", t.message, t)
    }
  }

  // ===== 7. Offerwall (1개) =====

  @ReactMethod
  fun openOfferwall(promise: Promise) {
    try {
      currentActivity?.let { activity ->
        AdchainSdk.openOfferwall(activity, object : OfferwallCallback {
          override fun onOpened() {
            promise.resolve(createResponse(true, "Offerwall opened"))
          }
          
          override fun onClosed() {
            // 이미 resolve 되었으므로 무시
          }
          
          override fun onError(message: String) {
            // 이미 resolve 되었으므로 무시
          }
          
          override fun onRewardEarned(amount: Int) {
            // 이미 resolve 되었으므로 무시
          }
        })
      } ?: promise.reject("OFFERWALL_ERROR", "Current activity is null")
    } catch (t: Throwable) {
      promise.reject("OFFERWALL_ERROR", t.message, t)
    }
  }

  // ===== Event Emitter Methods =====
  
  @ReactMethod
  fun addListener(eventName: String) {
    // iOS와의 호환성을 위해 필요하지만 Android에서는 구현 불필요
  }
  
  @ReactMethod
  fun removeListeners(count: Int) {
    // iOS와의 호환성을 위해 필요하지만 Android에서는 구현 불필요
  }
  
  // ===== Helper Methods =====
  
  private fun createResponse(success: Boolean, message: String): WritableMap {
    return Arguments.createMap().apply {
      putBoolean("success", success)
      putString("message", message)
    }
  }
  
  @Deprecated("Deprecated in Java")
  override fun onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy()
    quizInstances.clear()
    missionInstances.clear()
  }
}