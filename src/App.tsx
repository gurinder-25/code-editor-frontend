import { useState } from "react";
import { EditorScreen } from "./components/EditorScreen";
import { StdinModal } from "./components/StdinModal";
import { OutputScreen } from "./components/OutputScreen";
import { useExecuteCode } from "./context/execute-code/ExecuteCodeContext";
import { EXECUTE_STATUS } from "./context/execute-code/executeCodeTypes";
import { TEMPLATES } from "./lib/templates";
import type { Language, RunResult } from "./types";

export default function App() {
  const [screen, setScreen] = useState<"editor" | "output">("editor");
  const [showStdin, setShowStdin] = useState(false);
  const [language, setLanguage] = useState<Language>("Python");
  const [code, setCode] = useState(TEMPLATES.Python);
  const [stdin, setStdin] = useState("world");
  const [result, setResult] = useState<RunResult | null>(null);

  const { execute, loading } = useExecuteCode();

  const run = async (useStdin: boolean) => {
    const stdinText = useStdin ? stdin : "";
    const response = await execute({ language: language.toLowerCase(), code, stdin: stdinText });

    if (response) {
      const ok = response.status === EXECUTE_STATUS.SUCCESS && response.exitCode === 0;
      const parts = [response.stdout, response.stderr].filter(Boolean);
      setResult({
        output: parts.length ? parts.join("\n") : "// program finished with no output",
        exitCode: response.exitCode,
        status: ok ? "success" : "error",
        runtime: response.executionTimeMs,
      });
    } else {
      setResult({
        output: "Error: execution request failed",
        exitCode: 1,
        status: "error",
        runtime: 0,
      });
    }
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
          loading={loading}
          onStdinChange={setStdin}
          onRun={() => run(true)}
          onSkip={() => run(false)}
          onClose={() => setShowStdin(false)}
        />
      )}
    </>
  );
}
