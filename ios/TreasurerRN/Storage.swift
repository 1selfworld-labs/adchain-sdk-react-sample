import Foundation
import React

@objc(Storage)
class StorageModule: NSObject {

  @objc func setItem(_ key: NSString,
                    value: NSString,
                    resolver: @escaping RCTPromiseResolveBlock,
                    rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      UserDefaults.standard.set(value as String, forKey: key as String)
      resolver(true)
    } catch {
      rejecter("STORAGE_ERROR", error.localizedDescription, error)
    }
  }

  @objc func getItem(_ key: NSString,
                    resolver: @escaping RCTPromiseResolveBlock,
                    rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      let value = UserDefaults.standard.string(forKey: key as String)
      resolver(value)
    } catch {
      rejecter("STORAGE_ERROR", error.localizedDescription, error)
    }
  }
}

// MARK: - Objective-C Export

@objc(Storage)
extension StorageModule {
  @objc static func moduleName() -> String! {
    return "Storage"
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}