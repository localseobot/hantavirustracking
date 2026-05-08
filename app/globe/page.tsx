import GlobeView from "./GlobeView";

export const metadata = {
  title: "Hantavirus Globe — Live outbreak map",
  description:
    "Fullscreen interactive 3D globe of global hantavirus cases and deaths.",
};

export default function GlobePage() {
  return <GlobeView />;
}
