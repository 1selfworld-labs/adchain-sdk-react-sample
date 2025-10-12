import Foundation
import React
import AdchainSDK
import UIKit

@objc(AdchainSdk)
class AdchainSdkModule: RCTEventEmitter {
  
  // Helper function to get the top view controller
  private func getTopViewController() -> UIViewController? {
    guard let windowScene = UIApplication.shared.connectedScenes
            .compactMap({ $0 as? UIWindowScene })
            .first,
          let window = windowScene.windows.first(where: { $0.isKeyWindow }),
          let rootViewController = window.rootViewController else {
      return nil
    }
    
    var topController = rootViewController
    while let presentedViewController = topController.presentedViewController {
      topController = presentedViewController
    }
    
    return topController
  }
  
  // MARK: - Properties
  
  // 내부 인스턴스 관리 (자동 생성/캐싱)
  private var quizInstances: [String: AdchainQuiz] = [:]
  private var missionInstances: [String: AdchainMission] = [:]
  
  // MARK: - RCTEventEmitter
  
  @objc override static func requiresMainQueueSetup() -> Bool { true }
  
  override func supportedEvents() -> [String]! {
    return ["onQuizCompleted", "onMissionCompleted", "onMissionProgressed", "onMissionRefreshed"] // Quiz, Mission 이벤트 지원
  }
  
  // MARK: - 1. SDK 초기화
  
  @objc func initialize(_ appKey: NSString,
                       appSecret: NSString,
                       options: NSDictionary?,
                       resolver: @escaping RCTPromiseResolveBlock,
                       rejecter: @escaping RCTPromiseRejectBlock) {
    
    // options에서 environment와 timeout 추출
    let environment = options?["environment"] as? String
    let timeout = options?["timeout"] as? NSNumber
    
    let env: AdchainSdkConfig.Environment
    if let envString = environment {
      switch envString.uppercased() {
      case "STAGING":
        env = .staging
      case "DEVELOPMENT":
        env = .development
      default:
        env = .production
      }
    } else {
      env = .production
    }
    
    var configBuilder = AdchainSdkConfig.Builder(appKey: appKey as String, appSecret: appSecret as String)
      .setEnvironment(env)
    
    if let timeoutValue = timeout {
      configBuilder = configBuilder.setTimeout(TimeInterval(timeoutValue.doubleValue))
    }
    
    let config = configBuilder.build()
    
    // UI 관련 작업을 메인 스레드에서 실행
    DispatchQueue.main.async {
      if UIApplication.shared.delegate?.window??.rootViewController?.view.window?.windowScene?.delegate is UIWindowSceneDelegate {
        AdchainSdk.shared.initialize(application: UIApplication.shared, sdkConfig: config)
        resolver([
          "success": true,
          "message": "SDK initialized successfully"
        ])
      } else {
        // Fallback
        AdchainSdk.shared.initialize(application: UIApplication.shared, sdkConfig: config)
        resolver([
          "success": true,
          "message": "SDK initialized successfully"
        ])
      }
    }
  }
  
  // MARK: - 2. 인증 관련 (4개)
  
  @objc func login(_ userId: NSString,
                  userInfo: NSDictionary?,
                  resolver: @escaping RCTPromiseResolveBlock,
                  rejecter: @escaping RCTPromiseRejectBlock) {
    
    // userInfo에서 값 추출
    let gender = userInfo?["gender"] as? String
    let birthYear = userInfo?["birthYear"] as? NSNumber
    let customProperties = userInfo?["customProperties"] as? NSDictionary
    
    var userGender: AdchainSdkUser.Gender = .other
    if let genderString = gender {
      switch genderString.uppercased() {
      case "MALE", "M":
        userGender = .male
      case "FEMALE", "F":
        userGender = .female
      default:
        userGender = .other
      }
    }
    
    let user = AdchainSdkUser(
      userId: userId as String,
      gender: userGender,
      birthYear: birthYear?.intValue
    )
    
    // Custom properties 처리 (iOS SDK가 지원한다면)
    // 현재는 생략
    
    class LoginListenerImpl: NSObject, AdchainSdkLoginListener {
      let resolver: RCTPromiseResolveBlock
      let rejecter: RCTPromiseRejectBlock
      
      init(resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        self.resolver = resolver
        self.rejecter = rejecter
      }
      
      func onSuccess() {
        resolver([
          "success": true,
          "message": "Login successful"
        ])
      }
      
      func onFailure(_ error: AdchainLoginError) {
        rejecter("LOGIN_ERROR", error.description, nil)
      }
    }
    
    AdchainSdk.shared.login(adchainSdkUser: user, listener: LoginListenerImpl(resolver: resolver, rejecter: rejecter))
  }
  
  @objc func logout(_ resolver: @escaping RCTPromiseResolveBlock,
                   rejecter: @escaping RCTPromiseRejectBlock) {
    AdchainSdk.shared.logout()
    resolver([
      "success": true,
      "message": "Logout successful"
    ])
  }
  
  @objc func isLoggedIn(_ resolver: @escaping RCTPromiseResolveBlock,
                       rejecter: @escaping RCTPromiseRejectBlock) {
    resolver(AdchainSdk.shared.isLoggedIn)
  }
  
  @objc func getCurrentUser(_ resolver: @escaping RCTPromiseResolveBlock,
                           rejecter: @escaping RCTPromiseRejectBlock) {
    if let user = AdchainSdk.shared.getCurrentUser() {
      var userDict: [String: Any] = ["userId": user.userId]
      
      if let gender = user.gender {
        userDict["gender"] = gender.rawValue
      }
      
      if let birthYear = user.birthYear {
        userDict["birthYear"] = birthYear
      }
      
      resolver(userDict)
    } else {
      resolver(nil)
    }
  }
  
  // MARK: - 3. Quiz 관련 (2개)
  
  @objc func loadQuizList(_ unitId: NSString,
                         resolver: @escaping RCTPromiseResolveBlock,
                         rejecter: @escaping RCTPromiseRejectBlock) {
    // 인스턴스 자동 생성/재사용
    let quiz: AdchainQuiz = quizInstances[unitId as String] ?? {
      let newQuiz = AdchainQuiz()
      quizInstances[unitId as String] = newQuiz
      return newQuiz
    }()

    // Android와 동일하게 직접 load 호출
    // shouldStoreCallbacks: false로 설정하여 refreshAfterCompletion에서 재호출되지 않도록 함
    quiz.load(
      onSuccess: { quizResponse in
        var responseDict: [String: Any] = [
          "success": quizResponse.success ?? true
        ]

        if let titleText = quizResponse.titleText {
          responseDict["titleText"] = titleText
        }
        if let completedImageUrl = quizResponse.completedImageUrl {
          responseDict["completedImageUrl"] = completedImageUrl
        }
        if let completedImageWidth = quizResponse.completedImageWidth {
          responseDict["completedImageWidth"] = completedImageWidth
        }
        if let completedImageHeight = quizResponse.completedImageHeight {
          responseDict["completedImageHeight"] = completedImageHeight
        }
        if let message = quizResponse.message {
          responseDict["message"] = message
        }

        // events 배열 처리
        let eventsArray = quizResponse.events.map { quizEvent in
          return [
            "id": quizEvent.id,
            "title": quizEvent.title,
            "description": quizEvent.description ?? "",
            "imageUrl": quizEvent.imageUrl,
            "point": quizEvent.point,
            "isCompleted": quizEvent.completed ?? false
          ]
        }
        responseDict["events"] = eventsArray

        resolver(responseDict)
      },
      onFailure: { error in
        rejecter("QUIZ_LOAD_ERROR", error.localizedDescription, nil)
      },
      shouldStoreCallbacks: false
    )
  }
  
  @objc func clickQuiz(_ unitId: NSString,
                      quizId: NSString,
                      resolver: @escaping RCTPromiseResolveBlock,
                      rejecter: @escaping RCTPromiseRejectBlock) {
    // 인스턴스 자동 생성/재사용
    let quiz: AdchainQuiz = quizInstances[unitId as String] ?? {
      let newQuiz = AdchainQuiz()
      quizInstances[unitId as String] = newQuiz
      return newQuiz
    }()
    
    // QuizEventsListener 설정
    class QuizEventListenerImpl: NSObject, AdchainQuizEventsListener {
      weak var module: AdchainSdkModule?
      let unitId: String
      let quizId: String
      
      init(module: AdchainSdkModule?, unitId: String, quizId: String) {
        self.module = module
        self.unitId = unitId
        self.quizId = quizId
      }
      
      func onImpressed(_ quizEvent: QuizEvent) {
        // 필요시 처리
      }
      
      func onClicked(_ quizEvent: QuizEvent) {
        // 필요시 처리
      }
      
      func onQuizCompleted(_ quizEvent: QuizEvent, rewardAmount: Int) {
        // React Native로 이벤트 전송
        module?.sendEvent(withName: "onQuizCompleted", body: [
          "unitId": unitId,
          "quizId": quizId,
          "rewardAmount": rewardAmount,
          "timestamp": Date().timeIntervalSince1970
        ])
      }
    }
    
    let listener = QuizEventListenerImpl(module: self, unitId: unitId as String, quizId: quizId as String)
    quiz.setQuizEventsListener(listener)
    
    // iOS SDK가 ID 기반 클릭을 지원한다고 가정
    DispatchQueue.main.async { [weak self] in
      if let topVC = self?.getTopViewController() {
        // iOS SDK의 네이티브 ID 기반 메서드 사용 (Android와 동일)
        // 만약 이 메서드가 없다면 컴파일 오류가 발생할 것
        quiz.clickQuiz(quizId as String, from: topVC)
        resolver([
          "success": true,
          "message": "Quiz clicked"
        ])
      } else {
        rejecter("QUIZ_ERROR", "No view controller available", nil)
      }
    }
  }
  
  // MARK: - 4. Mission 관련 (3개)
  
  @objc func loadMissionList(_ unitId: NSString,
                            resolver: @escaping RCTPromiseResolveBlock,
                            rejecter: @escaping RCTPromiseRejectBlock) {
    // 인스턴스 자동 생성/재사용
    let mission: AdchainMission = missionInstances[unitId as String] ?? {
      let newMission = AdchainMission()
      missionInstances[unitId as String] = newMission
      return newMission
    }()

    // MissionEventsListener 설정 (missionRefreshed 이벤트를 받기 위해)
    // eventsListener가 없으면 설정
    if mission.eventsListener == nil {
      class LoadMissionEventListenerImpl: NSObject, AdchainMissionEventsListener {
        weak var module: AdchainSdkModule?
        let unitId: String

        init(module: AdchainSdkModule?, unitId: String) {
          self.module = module
          self.unitId = unitId
        }

        func onImpressed(_ mission: Mission) {
          // 필요시 처리
        }

        func onClicked(_ mission: Mission) {
          // 필요시 처리
        }

        func onCompleted(_ mission: Mission) {
          // React Native로 이벤트 전송
          module?.sendEvent(withName: "onMissionCompleted", body: [
            "unitId": unitId,
            "missionId": mission.id,
            "timestamp": Date().timeIntervalSince1970
          ])
        }

        func onProgressed(_ mission: Mission) {
          // React Native로 이벤트 전송
          module?.sendEvent(withName: "onMissionProgressed", body: [
            "unitId": unitId,
            "missionId": mission.id,
            "timestamp": Date().timeIntervalSince1970
          ])
        }

        func onRefreshed(unitId: String?) {
          // React Native로 이벤트 전송
          module?.sendEvent(withName: "onMissionRefreshed", body: [
            "unitId": unitId ?? self.unitId,
            "timestamp": Date().timeIntervalSince1970
          ])
        }
      }

      let listener = LoadMissionEventListenerImpl(module: self, unitId: unitId as String)
      mission.setEventsListener(listener)
    }

    // Android와 동일하게 직접 load 호출
    // shouldStoreCallbacks: false로 설정하여 refreshAfterCompletion에서 재호출되지 않도록 함
    mission.load(
      onSuccess: { (missionList, progress) in
        let missionsArray = missionList.map { m in
          return [
            "id": m.id,
            "title": m.title,
            "description": m.description,
            "imageUrl": m.imageUrl,
            "point": m.point,
            "isCompleted": m.status == "completed",
            "type": m.type?.rawValue ?? "normal",
            "actionUrl": m.landingUrl
          ]
        }
        
        let completedCount = progress.current
        let totalCount = progress.total
        
        let result: [String: Any] = [
          "missions": missionsArray,
          "completedCount": completedCount,
          "totalCount": totalCount,
          "canClaimReward": progress.isCompleted && totalCount > 0,

          // 신규 필드 추가 (MissionResponse에서 가져오기)
          "titleText": mission.missionResponse?.titleText ?? "무료 포인트 모으기!",
          "descriptionText": mission.missionResponse?.descriptionText ?? "간단 광고 참여하고 100 포인트 받기",
          "bottomText": mission.missionResponse?.bottomText ?? "800만 포인트 받으러 가기",
          "rewardIconUrl": mission.missionResponse?.rewardIconUrl ?? "https://adchain-assets.1self.world/img_reward_coin.png",
          "bottomIconUrl": mission.missionResponse?.bottomIconUrl ?? "https://adchain-assets.1self.world/img_offerwall_coin.png"
        ]
        
        resolver(result)
      },
      onFailure: { error in
        rejecter("MISSION_LOAD_ERROR", error.localizedDescription, nil)
      },
      shouldStoreCallbacks: false
    )
  }
  
  @objc func clickMission(_ unitId: NSString,
                         missionId: NSString,
                         resolver: @escaping RCTPromiseResolveBlock,
                         rejecter: @escaping RCTPromiseRejectBlock) {
    // 인스턴스 자동 생성/재사용
    let mission: AdchainMission = missionInstances[unitId as String] ?? {
      let newMission = AdchainMission()
      missionInstances[unitId as String] = newMission
      return newMission
    }()

    // MissionEventsListener 설정
    class MissionEventListenerImpl: NSObject, AdchainMissionEventsListener {
      weak var module: AdchainSdkModule?
      let unitId: String
      let missionId: String
      
      init(module: AdchainSdkModule?, unitId: String, missionId: String) {
        self.module = module
        self.unitId = unitId
        self.missionId = missionId
      }
      
      func onImpressed(_ mission: Mission) {
        // 필요시 처리
      }
      
      func onClicked(_ mission: Mission) {
        // 필요시 처리
      }
      
      func onCompleted(_ mission: Mission) {
        // React Native로 이벤트 전송
        module?.sendEvent(withName: "onMissionCompleted", body: [
          "unitId": unitId,
          "missionId": missionId,
          "timestamp": Date().timeIntervalSince1970
        ])
      }

      func onProgressed(_ mission: Mission) {
        // React Native로 이벤트 전송 (missionCompleted와 동일한 구조)
        module?.sendEvent(withName: "onMissionProgressed", body: [
          "unitId": unitId,
          "missionId": missionId,
          "timestamp": Date().timeIntervalSince1970
        ])
      }

      func onRefreshed(unitId: String?) {
        // React Native로 이벤트 전송
        module?.sendEvent(withName: "onMissionRefreshed", body: [
          "unitId": unitId ?? self.unitId,
          "timestamp": Date().timeIntervalSince1970
        ])
      }
    }
    
    let listener = MissionEventListenerImpl(module: self, unitId: unitId as String, missionId: missionId as String)
    mission.setEventsListener(listener)
    
    // iOS SDK가 ID 기반 클릭을 지원한다고 가정
    DispatchQueue.main.async { [weak self] in
      if let topVC = self?.getTopViewController() {
        // iOS SDK의 네이티브 ID 기반 메서드 사용 (Android와 동일)
        // 만약 이 메서드가 없다면 컴파일 오류가 발생할 것
        mission.clickMission(missionId as String, from: topVC)
        resolver([
          "success": true,
          "message": "Mission clicked"
        ])
      } else {
        rejecter("MISSION_ERROR", "No view controller available", nil)
      }
    }
  }
  
  @objc func claimReward(_ unitId: NSString,
                        resolver: @escaping RCTPromiseResolveBlock,
                        rejecter: @escaping RCTPromiseRejectBlock) {
    // 인스턴스 자동 생성/재사용
    let mission: AdchainMission = missionInstances[unitId as String] ?? {
      let newMission = AdchainMission()
      missionInstances[unitId as String] = newMission
      return newMission
    }()
    
    DispatchQueue.main.async { [weak self] in
      if let topVC = self?.getTopViewController() {
        mission.onRewardButtonClicked(from: topVC)
        resolver([
          "success": true,
          "message": "Reward claimed"
        ])
      } else {
        rejecter("MISSION_ERROR", "No view controller available", nil)
      }
    }
  }
  
  // MARK: - 5. Debug/Utility Methods (3개)

  @objc func isInitialized(_ resolver: @escaping RCTPromiseResolveBlock,
                          rejecter: @escaping RCTPromiseRejectBlock) {
    resolver(AdchainSdk.shared.isInitialized())
  }

  @objc func getUserId(_ resolver: @escaping RCTPromiseResolveBlock,
                       rejecter: @escaping RCTPromiseRejectBlock) {
    let userId = AdchainSdk.shared.getCurrentUser()?.userId ?? ""
    resolver(userId)
  }

  @objc func getIFA(_ resolver: @escaping RCTPromiseResolveBlock,
                    rejecter: @escaping RCTPromiseRejectBlock) {
    // SDK의 getAdvertisingId 메서드를 사용하여 IFA 가져오기
    // SDK가 캐싱, 권한 처리, 에러 처리 등을 모두 관리함
    AdchainSdk.shared.getAdvertisingId { advertisingId in
      resolver(advertisingId)
    }
  }

  // MARK: - 6. Banner (1개)

  @objc func getBannerInfo(_ placementId: String,
                          resolver: @escaping RCTPromiseResolveBlock,
                          rejecter: @escaping RCTPromiseRejectBlock) {
    AdchainSdk.shared.getBannerInfo(placementId: placementId) { result in
      switch result {
      case .success(let response):
        resolver([
          "success": response.success,
          "imageUrl": response.imageUrl as Any,
          "imageWidth": response.imageWidth as Any,
          "imageHeight": response.imageHeight as Any,
          "titleText": response.titleText as Any,
          "linkType": response.linkType as Any,
          "internalLinkUrl": response.internalLinkUrl as Any,
          "externalLinkUrl": response.externalLinkUrl as Any
        ])
      case .failure(let error):
        rejecter("BANNER_ERROR", error.localizedDescription, error)
      }
    }
  }

  // MARK: - 7. Offerwall (3개)

  @objc func openOfferwall(_ placementId: NSString?,
                          resolver: @escaping RCTPromiseResolveBlock,
                          rejecter: @escaping RCTPromiseRejectBlock) {
    class OfferwallCallbackImpl: NSObject, OfferwallCallback {
      let resolver: RCTPromiseResolveBlock
      var hasResolved = false

      init(resolver: @escaping RCTPromiseResolveBlock) {
        self.resolver = resolver
      }

      func onOpened() {
        if !hasResolved {
          hasResolved = true
          resolver([
            "success": true,
            "message": "Offerwall opened"
          ])
        }
      }

      func onClosed() {
        // 이미 resolve 되었으므로 무시
      }

      func onError(_ message: String) {
        // 이미 resolve 되었으므로 무시
      }

      func onRewardEarned(_ amount: Int) {
        // 이미 resolve 되었으므로 무시
      }
    }

    DispatchQueue.main.async { [weak self] in
      if let topVC = self?.getTopViewController() {
        let callback = OfferwallCallbackImpl(resolver: resolver)
        let finalPlacementId = (placementId as String?) ?? ""
        AdchainSdk.shared.openOfferwall(
          presentingViewController: topVC,
          placementId: finalPlacementId,
          callback: callback
        )
      } else {
        rejecter("OFFERWALL_ERROR", "No view controller available", nil)
      }
    }
  }

  @objc func openOfferwallWithUrl(_ url: NSString,
                                  placementId: NSString?,
                                  resolver: @escaping RCTPromiseResolveBlock,
                                  rejecter: @escaping RCTPromiseRejectBlock) {
    class OfferwallCallbackImpl: NSObject, OfferwallCallback {
      let resolver: RCTPromiseResolveBlock
      var hasResolved = false

      init(resolver: @escaping RCTPromiseResolveBlock) {
        self.resolver = resolver
      }

      func onOpened() {
        if !hasResolved {
          hasResolved = true
          resolver([
            "success": true,
            "message": "Offerwall opened with URL"
          ])
        }
      }

      func onClosed() {
        // 이미 resolve 되었으므로 무시
      }

      func onError(_ message: String) {
        // 이미 resolve 되었으므로 무시
      }

      func onRewardEarned(_ amount: Int) {
        // 이미 resolve 되었으므로 무시
      }
    }

    DispatchQueue.main.async { [weak self] in
      if let topVC = self?.getTopViewController() {
        let callback = OfferwallCallbackImpl(resolver: resolver)
        let finalPlacementId = (placementId as String?) ?? ""
        AdchainSdk.shared.openOfferwallWithUrl(
          url as String,
          placementId: finalPlacementId,
          presentingViewController: topVC,
          callback: callback
        )
      } else {
        rejecter("OFFERWALL_ERROR", "No view controller available", nil)
      }
    }
  }

  @objc func openExternalBrowser(_ url: NSString,
                                placementId: NSString?,
                                resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
    let finalPlacementId = (placementId as String?) ?? ""
    let success = AdchainSdk.shared.openExternalBrowser(
      url as String,
      placementId: finalPlacementId
    )
    if success {
      resolver([
        "success": true,
        "message": "External browser opened"
      ])
    } else {
      rejecter("BROWSER_ERROR", "Failed to open external browser", nil)
    }
  }

  @objc func openAdjoeOfferwall(_ placementId: NSString?,
                                resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
    class OfferwallCallbackImpl: NSObject, OfferwallCallback {
      let resolver: RCTPromiseResolveBlock
      var hasResolved = false

      init(resolver: @escaping RCTPromiseResolveBlock) {
        self.resolver = resolver
      }

      func onOpened() {
        if !hasResolved {
          hasResolved = true
          resolver([
            "success": true,
            "message": "Adjoe Offerwall opened"
          ])
        }
      }

      func onClosed() {
        // 이미 resolve 되었으므로 무시
      }

      func onError(_ message: String) {
        // 이미 resolve 되었으므로 무시
      }

      func onRewardEarned(_ amount: Int) {
        // 이미 resolve 되었으므로 무시
      }
    }

    DispatchQueue.main.async { [weak self] in
      if let topVC = self?.getTopViewController() {
        let callback = OfferwallCallbackImpl(resolver: resolver)
        let finalPlacementId = (placementId as String?) ?? ""
        AdchainSdk.shared.openAdjoeOfferwall(
          presentingViewController: topVC,
          placementId: finalPlacementId,
          callback: callback
        )
      } else {
        rejecter("ADJOE_ERROR", "No view controller available", nil)
      }
    }
  }
}

// MARK: - Objective-C Export

@objc(AdchainSdk)
extension AdchainSdkModule {
  @objc override static func moduleName() -> String! {
    return "AdchainSdk"
  }
}
