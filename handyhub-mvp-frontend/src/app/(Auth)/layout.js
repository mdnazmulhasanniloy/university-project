import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";

export default function AuthLayout({ children }) {
  return (
    <ResponsiveContainer className="flex-center min-h-[75vh]">
      <div className="mx-auto w-full rounded-lg border bg-white p-6 shadow-md sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-[40%] 3xl:w-1/3">
        {children}
      </div>
    </ResponsiveContainer>
  );
}
