import type { Language } from "../types";

/**
 * Starter snippets shown when a language is selected. The non-JavaScript
 * ones run through the pattern-matching interpreter (see interpreter.ts),
 * so the `for i in range(n):` loop shape and print calls are kept within
 * what it actually understands.
 */
export const TEMPLATES: Record<Language, string> = {
  Python: `name = input()
print("Hello, " + name + "!")

for i in range(3):
    print("line", i)
`,
  JavaScript: `const name = input();
console.log("Hello, " + name + "!");

for (let i = 0; i < 3; i++) {
  console.log("line", i);
}
`,
  "C++": `#include <iostream>
using namespace std;

int main() {
    string name = cin;
    cout << "Hello, " << name << "!" << endl;

    for i in range(3):
        cout << "line " << i << endl;
}
`,
  Java: `public class Main {
    public static void main(String[] args) {
        String name = input();
        System.out.println("Hello, " + name + "!");

        for i in range(3):
            System.out.println("line " + i);
    }
}
`,
  Go: `package main

import "fmt"

func main() {
    var name = input()
    fmt.Println("Hello, " + name + "!")

    for i in range(3):
        fmt.Println("line", i)
}
`,
  Ruby: `name = gets()
puts "Hello, " + name + "!"

for i in range(3):
    puts "line", i
`,
  "Plain text": `Just plain text — nothing here gets executed as code.
`,
};
