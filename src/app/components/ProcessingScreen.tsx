import { motion } from "motion/react";

const steps = [
  "Analyzing garment structure",
  "Identifying construction details",
  "Estimating materials & trims",
  "Generating measurements",
  "Compiling tech pack",
];

interface ProcessingScreenProps {
  currentStep: number;
}

export function ProcessingScreen({ currentStep }: ProcessingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal top bar */}
      <header className="flex items-center h-14 px-6 border-b border-burgundy/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-[22px] h-[22px] rounded-md bg-burgundy-950 flex items-center justify-center">
            <span className="text-white" style={{ fontSize: "10px", fontWeight: 600 }}>T</span>
          </div>
          <span className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            TechPack AI
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-xs">
          {/* Progress bar */}
          <div className="h-1 w-full bg-burgundy-950/[0.06] rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-burgundy-950 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-2.5">
            {steps.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-3"
              >
                <div
                  className={`w-1 h-1 rounded-full flex-shrink-0 transition-colors duration-300 ${
                    i < currentStep
                      ? "bg-burgundy-950"
                      : i === currentStep
                      ? "bg-burgundy"
                      : "bg-burgundy-950/10"
                  }`}
                />
                <span
                  className={`transition-colors duration-300 ${
                    i <= currentStep ? "text-foreground" : "text-muted-foreground/30"
                  }`}
                  style={{ fontSize: "0.813rem" }}
                >
                  {step}
                  {i === currentStep && (
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-0.5"
                    >
                      …
                    </motion.span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
