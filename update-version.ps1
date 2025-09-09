# PowerShell script لتحديث إصدار التطبيق
# يجب تشغيل هذا السكربت قبل عملية النشر

# استخراج الإصدار الحالي من package.json
$packageJson = Get-Content -Path "package.json" | ConvertFrom-Json
$currentVersion = $packageJson.version

# تقسيم الإصدار إلى أجزاء (major.minor.patch)
$versionParts = $currentVersion -split "\."
$major = [int]$versionParts[0]
$minor = [int]$versionParts[1]
$patch = [int]$versionParts[2]

# زيادة رقم الإصدار الفرعي (patch)
$patch++

# إعادة تكوين رقم الإصدار الجديد
$newVersion = "$major.$minor.$patch"

# تحديث الإصدار في package.json
$packageJson.version = $newVersion
$packageJson | ConvertTo-Json -Depth 100 | Set-Content -Path "package.json"

# تحديث الإصدار في ملف version.ts
$versionContent = Get-Content -Path "src\utils\version.ts"
$updatedContent = $versionContent -replace "export const APP_VERSION = '[0-9]+\.[0-9]+\.[0-9]+'", "export const APP_VERSION = '$newVersion'"
Set-Content -Path "src\utils\version.ts" -Value $updatedContent

Write-Host "تم تحديث الإصدار إلى $newVersion"

# تنفيذ عمليات البناء والنشر
npm run build
npm run deploy
