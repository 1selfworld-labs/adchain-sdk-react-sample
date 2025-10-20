import Foundation
import React
import AdchainSDK

@objc(AdchainOfferwallViewManager)
class AdchainOfferwallViewManager: RCTViewManager {

    override func view() -> UIView! {
        let offerwallView = AdchainOfferwallRNView()
        return offerwallView
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

// Wrapper view for React Native
@objc(AdchainOfferwallRNView)
class AdchainOfferwallRNView: UIView {

    private var offerwallView: AdchainOfferwallView?
    private var pendingPlacementId: String?

    @objc var placementId: NSString = "" {
        didSet {
            let placementIdStr = placementId as String
            guard !placementIdStr.isEmpty else { return }

            pendingPlacementId = placementIdStr
            loadOfferwallIfReady()
        }
    }

    @objc var onOfferwallOpened: RCTDirectEventBlock?
    @objc var onOfferwallClosed: RCTDirectEventBlock?
    @objc var onOfferwallError: RCTDirectEventBlock?
    @objc var onRewardEarned: RCTDirectEventBlock?

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupOfferwallView()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupOfferwallView()
    }

    private func setupOfferwallView() {
        let view = AdchainOfferwallView(frame: bounds)
        view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        addSubview(view)
        offerwallView = view
    }

    private func loadOfferwallIfReady() {
        guard let placementId = pendingPlacementId,
              let view = offerwallView else {
            return
        }

        guard let config = AdchainSdk.shared.getConfig(),
              let user = AdchainSdk.shared.getCurrentUser(),
              let offerwallUrl = AdchainSdk.shared.getOfferwallUrl() else {
            if AdchainSdk.shared.getConfig() == nil {
                sendErrorEvent(error: "SDK not initialized")
            } else if AdchainSdk.shared.getCurrentUser() == nil {
                sendErrorEvent(error: "User not logged in")
            } else {
                sendErrorEvent(error: "Offerwall URL not available")
            }
            return
        }

        // Set callback for offerwall events
        view.setCallback(RNOfferwallCallback(
            onOpened: { [weak self] in
                self?.sendEvent(name: "onOfferwallOpened", body: [:])
            },
            onClosed: { [weak self] in
                self?.sendEvent(name: "onOfferwallClosed", body: [:])
            },
            onError: { [weak self] error in
                self?.sendEvent(name: "onOfferwallError", body: ["error": error])
            },
            onRewardEarned: { [weak self] amount in
                self?.sendEvent(name: "onRewardEarned", body: ["amount": amount])
            }
        ))

        // Load offerwall
        view.loadOfferwall(
            baseUrl: offerwallUrl,
            userId: user.userId,
            appKey: config.appKey,
            placementId: placementId
        )

        // Clear pending
        pendingPlacementId = nil
    }

    private func sendEvent(name: String, body: [String: Any]) {
        switch name {
        case "onOfferwallOpened":
            onOfferwallOpened?(body)
        case "onOfferwallClosed":
            onOfferwallClosed?(body)
        case "onOfferwallError":
            onOfferwallError?(body)
        case "onRewardEarned":
            onRewardEarned?(body)
        default:
            break
        }
    }

    private func sendErrorEvent(error: String) {
        sendEvent(name: "onOfferwallError", body: ["error": error])
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        offerwallView?.frame = bounds
    }
}

// Custom callback implementation for React Native
class RNOfferwallCallback: OfferwallCallback {
    private let onOpenedHandler: () -> Void
    private let onClosedHandler: () -> Void
    private let onErrorHandler: (String) -> Void
    private let onRewardEarnedHandler: (Int) -> Void

    init(onOpened: @escaping () -> Void,
         onClosed: @escaping () -> Void,
         onError: @escaping (String) -> Void,
         onRewardEarned: @escaping (Int) -> Void) {
        self.onOpenedHandler = onOpened
        self.onClosedHandler = onClosed
        self.onErrorHandler = onError
        self.onRewardEarnedHandler = onRewardEarned
    }

    func onOpened() {
        onOpenedHandler()
    }

    func onClosed() {
        onClosedHandler()
    }

    func onError(_ message: String) {
        onErrorHandler(message)
    }

    func onRewardEarned(_ amount: Int) {
        onRewardEarnedHandler(amount)
    }
}
