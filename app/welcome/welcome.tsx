import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="text-center">
        <button className="btn btn-primary" onClick={() => console.log("clicked")}>
          Test
        </button>
      </div>
    </main>
  );
}
