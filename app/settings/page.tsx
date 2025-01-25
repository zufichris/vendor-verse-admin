import { SettingsTabs } from "@/components/settings/settings-tabs"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full pt-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        <SettingsTabs />
      </div>
  )
}

