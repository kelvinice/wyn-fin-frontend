import { TiltAble } from "~/components/common/tiltable";

export function TiltTester() {
  return (
    <div className="flex justify-center">
      <TiltAble className="w-48 h-48" tiltMaxDegrees={20}>
        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center p-4 text-primary-content">
          <p className="text-center font-medium">Hover over me to see the tilt effect</p>
        </div>
      </TiltAble>
    </div>
  );
}