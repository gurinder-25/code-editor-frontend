import { useState } from "react";
import { EditorScreen } from "./components/EditorScreen";
import { StdinModal } from "./components/StdinModal";
import { OutputScreen } from "./components/OutputScreen";
import { runJavaScript } from "./lib/jsRunner";
import { interpret } from "./lib/interpreter";
import { TEMPLATES } from "./lib/templates";
import type { Language, RunResult } from "./types";

export default function App() {
  const [screen, setScreen] = useState<"editor" | "output">("editor");
  const [showStdin, setShowStdin] = useState(false);
  const [language, setLanguage] = useState<Language>("Python");
  const [code, setCode] = useState(TEMPLATES.Python);
  const [stdin, setStdin] = useState("world");
  const [result, setResult] = useState<RunResult | null>(null);

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

    setResult({
      output,
      exitCode: outcome.ok ? 0 : 1,
      status: outcome.ok ? "success" : "error",
      runtime,
      usedStdin: useStdin && inputs.length > 0,
      stdin: stdinText,
      simulated,
    });
    setShowStdin(false);
    setScreen("output");
  };

  return (
    <>
      {screen === "editor" ? (
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
      ) : (
        result && (
          <OutputScreen
            result={result}
            onBack={() => setScreen("editor")}
            onRunAgain={() => setShowStdin(true)}
          />
        )
      )}
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
