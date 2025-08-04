import { router, usePage } from '@inertiajs/react'
import { Button } from './ui/button'
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarNav, 
  SidebarNavItem, 
  SidebarToggle,
  SidebarFooter,
  useSidebar 
} from './ui/sidebar'

function DashboardIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
    </svg>
  )
}

function SettingsIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function DistrictsIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function ClientsIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function SchoolsIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  )
}

function StudentsIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function UploadIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  )
}

function MobileSidebar({ auth, handleLogout }) {
  const { open, toggle } = useSidebar()

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={toggle}
      />
      
      {/* Mobile Sidebar */}
      <div className="fixed left-0 top-0 z-50 h-full w-64 border-r lg:hidden" style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-foreground">STS v2</h1>
            </div>
            <button
              onClick={toggle}
              className="rounded-md p-2 hover:bg-accent"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              <SidebarNavItem href="/dashboard" icon={DashboardIcon}>
                Dashboard
              </SidebarNavItem>
              <SidebarNavItem href="/districts" icon={DistrictsIcon}>
                Districts
              </SidebarNavItem>
              <SidebarNavItem href="/schools" icon={SchoolsIcon}>
                Schools
              </SidebarNavItem>
              <SidebarNavItem href="/students" icon={StudentsIcon}>
                Students
              </SidebarNavItem>
              <SidebarNavItem href="/upload-batches" icon={UploadIcon}>
                Student Data Upload
              </SidebarNavItem>
              <SidebarNavItem href="/clients" icon={ClientsIcon}>
                Clients
              </SidebarNavItem>
              <SidebarNavItem href="/settings/year-and-terms" icon={SettingsIcon}>
                Settings
              </SidebarNavItem>
            </nav>
          </div>
          
          {/* Mobile Sidebar Footer */}
          <div className="border-t p-4">
            <div className="flex flex-col space-y-2">
              <div className="text-xs text-muted-foreground px-2">
                {auth?.user?.name || auth?.user?.email}
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function MobileSidebarContent() {
  const { open } = useSidebar()
  
  return open && <h1 className="text-xl font-bold text-foreground">STS v2</h1>
}

function TopBar() {
  const { activePeriod } = usePage().props
  const { open } = useSidebar()

  return (
    <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: 'hsl(var(--navbar-bg))' }}>
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <SidebarToggle className="lg:hidden" />
          <div className="hidden lg:block">
            <SidebarToggle />
          </div>
          <h1 className="text-xl font-bold text-foreground lg:hidden">STS v2</h1>
          {open && (
            <h1 className="text-xl font-bold text-foreground hidden lg:block">STS v2</h1>
          )}
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Active Period Display */}
          {activePeriod?.has_active_period ? (
            <div className="flex items-center space-x-2 bg-primary/10 text-primary px-2 lg:px-3 py-1.5 rounded-full">
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-xs lg:text-sm">{activePeriod.period_string}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-destructive/10 text-destructive px-2 lg:px-3 py-1.5 rounded-full">
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium text-xs lg:text-sm">No active period</span>
            </div>
          )}
          
        </div>
      </div>
    </header>
  )
}

export default function DashboardLayout({ children }) {
  const { auth } = usePage().props

  const handleLogout = (e) => {
    e.preventDefault()
    router.post('/logout')
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen" style={{ backgroundColor: 'white' }}>
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex">
          <SidebarHeader>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <MobileSidebarContent />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarNav>
              <SidebarNavItem href="/dashboard" icon={DashboardIcon}>
                Dashboard
              </SidebarNavItem>
              <SidebarNavItem href="/districts" icon={DistrictsIcon}>
                Districts
              </SidebarNavItem>
              <SidebarNavItem href="/schools" icon={SchoolsIcon}>
                Schools
              </SidebarNavItem>
              <SidebarNavItem href="/students" icon={StudentsIcon}>
                Students
              </SidebarNavItem>
              <SidebarNavItem href="/upload-batches" icon={UploadIcon}>
                Student Data Upload
              </SidebarNavItem>
              <SidebarNavItem href="/clients" icon={ClientsIcon}>
                Clients
              </SidebarNavItem>
              <SidebarNavItem href="/settings/year-and-terms" icon={SettingsIcon}>
                Settings
              </SidebarNavItem>
            </SidebarNav>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="flex flex-col space-y-2 p-2">
              <div className="text-xs text-muted-foreground px-2">
                {auth?.user?.name || auth?.user?.email}
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Sidebar Overlay */}
        <MobileSidebar auth={auth} handleLogout={handleLogout} />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 lg:px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}