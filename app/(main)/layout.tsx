// import Header from "@/components/header/page"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Header /> */}
      <main>{children}</main>
    </>
  );
}