import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="order-updates">Order Updates</Label>
            <Switch id="order-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="new-vendors">New Vendor Applications</Label>
            <Switch id="new-vendors" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing">Marketing Communications</Label>
            <Switch id="marketing" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch id="push-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="browser-notifications">Browser Notifications</Label>
            <Switch id="browser-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
            <Switch id="sms-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsapp-notifications">WhatsApp Notifications</Label>
            <Switch id="whatsapp-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="slack-notifications">Slack Notifications</Label>
            <Switch id="slack-notifications" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}

