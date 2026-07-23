import { useState } from "react";
import { EditorScreen } from "./components/EditorScreen";
import { StdinModal } from "./components/StdinModal";
import { runJavaScript } from "./lib/jsRunner";
import { interpret } from "./lib/interpreter";
import { TEMPLATES } from "./lib/templates";
import type { Language, RunResult } from "./types";

export default function App() {
  const [showStdin, setShowStdin] = useState(false);
  const [language, setLanguage] = useState<Language>("Python");
  const [code, setCode] = useState(TEMPLATES.Python);
  const [stdin, setStdin] = useState("world");
  const [, setResult] = useState<RunResult | null>(null);

  const execute = async (useStdin: boolean) => {
    const stdinText = useStdin ? stdin : "";
    const inputs = stdinText.length ? stdinText.split(/\r?\n/) : [];
    const simulated = language !== "JavaScript";

    const t0 = performance.now();
    const outcome = simulated
      ? interpret(code, inputs)
      : await runJavaScript(code, inputs);
    const runtime = Math.max(1, Math.round(performance.now() - t0));

    let output: string;
    if (outcome.error)
      output = outcome.out.length
        ? outcome.out.join("\n") + "\n" + outcome.error
        : outcome.error;
    else if (outcome.out.length === 0) output = "// program finished with no output";
    else output = outcome.out.join("\n");

    const runResult: RunResult = {
      output,
      exitCode: outcome.ok ? 0 : 1,
      status: outcome.ok ? "success" : "error",
      runtime,
      usedStdin: useStdin && inputs.length > 0,
      stdin: stdinText,
      simulated,
    };
    // Output screen lands in the next step; log the result for now.
    console.log(runResult);
    setResult(runResult);
    setShowStdin(false);
  };

  return (
    <>
      <EditorScreen
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          setCode(TEMPLATES[lang]);
        }}
        code={code}
        onCodeChange={setCode}
        onExecute={() => setShowStdin(true)}
      />
      {showStdin && (
        <StdinModal
          stdin={stdin}
          onStdinChange={setStdin}
          onRun={() => execute(true)}
          onSkip={() => execute(false)}
          onClose={() => setShowStdin(false)}
        />
      )}
    </>
  );
}
