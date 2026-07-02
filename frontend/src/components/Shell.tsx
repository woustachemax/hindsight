export const Shell = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06), transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div
        className="absolute left-[-10%] top-[10%] h-80 w-[320px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.055), transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div
        className="absolute right-[-8%] bottom-[8%] h-65 w-65 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.035), transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(transparent 50%, rgba(255,255,255,0.09) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      <div className="relative z-10 flex h-screen w-full flex-col items-center p-8">
        {children}
      </div>
    </div>
  )
}