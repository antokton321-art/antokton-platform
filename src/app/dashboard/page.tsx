import ModerationQueue from '@/components/ModerationQueue'

export default function DashboardPage(){
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card">
          <h3 className="font-medium">Your activity</h3>
        </div>
        <div className="card">
          <h3 className="font-medium">Moderation</h3>
          <ModerationQueue />
        </div>
      </div>
    </div>
  )
}
