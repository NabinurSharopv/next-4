export default function adminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {children}
    </div>
  );
}