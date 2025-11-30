// src/pages/dashboard/DashboardPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground">$45,231.89</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+20.1% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <span className="text-muted-foreground">+2350</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+180.1% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <span className="text-muted-foreground">+12,234</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+19% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <span className="text-muted-foreground">+573</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+201 since last hour</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}