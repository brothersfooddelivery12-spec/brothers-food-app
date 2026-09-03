import ExpoModulesCore

public class UpiAppsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("UpiApps")

    AsyncFunction("setValueAsync") { (value: String) in
    }
  }
}
