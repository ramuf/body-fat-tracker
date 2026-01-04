import "./auth-theme.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div suppressHydrationWarning className="auth-theme min-h-screen flex flex-col">
      {children}
    </div>
  )
}
