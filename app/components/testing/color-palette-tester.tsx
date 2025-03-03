export function ColorPaletteTester() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {["primary", "secondary", "accent", "info", "success", "warning", "error"].map((color) => (
        <div key={color} className={`btn btn-${color} p-3 rounded-md text-${color}-content`}>
          {color}
        </div>
      ))}
    </div>
  );
}

export function BaseColorsTester() {
  return (
    <div className="space-y-2">
      {["base-100", "base-200", "base-300", "neutral"].map((color) => (
        <div key={color} className={`bg-${color} p-3 rounded-md border border-base-content/10 flex justify-between`}>
          <span>{color}</span>
          <span className="opacity-60 text-sm">Background color</span>
        </div>
      ))}
    </div>
  );
}