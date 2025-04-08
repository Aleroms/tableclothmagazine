import NavButton from "./ui/button/navigationButton";

export default function NotFound() {
  return (
    <div className="max-w-4xl m-4 p-8 lg:m-auto flex flex-col items-center justify-center text-center h-[600px]">
      <h1 className="font-bold text-7xl mb-8">404!</h1>
      <p>Uh oh! We couldn&apos;t find the page you were looking for!</p>
      <NavButton
        className="mt-8 border-1 border-solid border-stone-400 bg-[var(--foreground)]  transition hover:bg-stone-100 focus:border-black text-stone-700"
        href="/"
      >
        Home
      </NavButton>
    </div>
  );
}
