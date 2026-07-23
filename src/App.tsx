import { useState } from "react";
import { EditorScreen } from "./components/EditorScreen";
import { StdinModal } from "./components/StdinModal";
import { TEMPLATES } from "./lib/templates";
import type { Language } from "./types";

export default function App() {
  const [showStdin, setShowStdin] = useState(false);
  const [language, setLanguage] = useState<Language>("Python");
  const [code, setCode] = useState(TEMPLATES.Python);
  const [stdin, setStdin] = useState("world");

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
          onRun={() => setShowStdin(false)}
          onSkip={() => setShowStdin(false)}
          onClose={() => setShowStdin(false)}
        />
      )}
    </>
  );
}
