/**
 * Starter snippets shown when a language is selected, keyed by the backend's
 * language codes (see GET /api/v1/languages). Unknown languages fall back to an
 * empty editor via getTemplate().
 */
export const TEMPLATES: Record<string, string> = {
  PYTHON: `name = input()
print(f"Hello, {name}!")
`,
  JAVASCRIPT: `console.log("Hello, World!");
`,
  JAVA: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  C: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,
  CPP: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
};

/** Returns the starter snippet for a language, or an empty string if none. */
export function getTemplate(language: string): string {
  return TEMPLATES[language] ?? "";
}
