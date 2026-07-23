import { useState } from "react";
import { EditorScreen } from "./components/EditorScreen";
import { TEMPLATES } from "./lib/templates";
import type { Language } from "./types";

export default function App() {
  const [language, setLanguage] = useState<Language>("Python");
  const [code, setCode] = useState(TEMPLATES.Python);

  return (
    <EditorScreen
      language={language}
      onLanguageChange={(lang) => {
        setLanguage(lang);
        setCode(TEMPLATES[lang]);
      }}
      code={code}
      onCodeChange={setCode}
      onExecute={() => {}}
    />
  );
}
