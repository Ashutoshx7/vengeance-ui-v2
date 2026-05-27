import { BeamTunnel } from "@/components/ui/beam-tunnel";

export function BeamTunnelDemo() {
  return (
    <div className="flex w-full h-[500px] flex-col items-center justify-center p-4">
      <BeamTunnel className="rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-sm text-center border border-white/20 dark:border-white/10">
          <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
            Congratulations on Your Promotion!
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">
            Your hard work and dedication have paid off. We're thrilled to see you
            take this next step. Keep up the fantastic work!
          </p>
          <a 
            href="#" 
            className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Read the full announcement &rarr;
          </a>
        </div>
      </BeamTunnel>
    </div>
  );
}

export default BeamTunnelDemo;
