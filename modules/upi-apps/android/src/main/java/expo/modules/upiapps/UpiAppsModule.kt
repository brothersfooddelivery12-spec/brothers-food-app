package expo.modules.upiapps

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class UpiAppsModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("UpiApps")

        AsyncFunction("getInstalledUpiApps") {

            val context = appContext.reactContext
                ?: return@AsyncFunction emptyList<Map<String, String>>()

            val packageManager = context.packageManager

            val intent = Intent(
                Intent.ACTION_VIEW,
                Uri.parse("upi://pay")
            ).apply {
                addCategory(Intent.CATEGORY_BROWSABLE)
            }

            val apps =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {

                    packageManager.queryIntentActivities(
                        intent,
                        PackageManager.ResolveInfoFlags.of(
                            PackageManager.MATCH_DEFAULT_ONLY.toLong()
                        )
                    )

                } else {

                    @Suppress("DEPRECATION")
                    packageManager.queryIntentActivities(
                        intent,
                        PackageManager.MATCH_DEFAULT_ONLY
                    )
                }

            apps
                .distinctBy {
                    it.activityInfo.packageName
                }
                .map {
                    mapOf(
                        "name" to it.loadLabel(packageManager).toString(),
                        "packageName" to it.activityInfo.packageName
                    )
                }
        }
    }
}