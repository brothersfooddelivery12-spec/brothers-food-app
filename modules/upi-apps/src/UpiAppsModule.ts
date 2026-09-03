import { requireNativeModule } from "expo-modules-core"

import type { InstalledUpiApp } from "./UpiApps.types"

type UpiAppsModuleType = {
    getInstalledUpiApps: () => Promise<InstalledUpiApp[]>
}

const UpiApps =
    requireNativeModule<UpiAppsModuleType>(
        "UpiApps"
    )

export default UpiApps