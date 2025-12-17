export default function ErrorBox({ children }: { children: React.ReactNode }){
  return <div className="text-red-700 bg-red-50 border border-red-100 rounded p-3">{children}</div>
}
