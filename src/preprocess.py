import os
import re

SOURCE_DIR = "src"
ROOT_DIR = "."

# Mapping of GitHub-style admonition types to MkDocs-style
ADMONITION_MAP = {
    "note": "note",
    "important": "important",
    "tip": "tip",
    "info": "info",
    "warning": "warning",
    "caution": "caution",
    "danger": "danger",
    "error": "danger",
    "success": "success",
    "question": "question",
    "abstract": "abstract",
    "summary": "summary",
    "todo": "todo",
    "quote": "quote",
    "seealso": "seealso",
    "example": "example",
    "bug": "bug",
}

def convert_admonitions(text):
    # Matches > [!WARNING] style GitHub markdown
    pattern = re.compile(r'> \[!(\w+)\]\n((?:> .*\n?)*)')

    def replacer(match):
        raw_label = match.group(1).lower()
        content = match.group(2)

        label = ADMONITION_MAP.get(raw_label)
        if not label:
            return match.group(0)

        lines = [
            f"    {line[2:]}" for line in content.strip().splitlines()
            if line.startswith("> ")
        ]
        return f"!!! {label}\n" + "\n".join(lines)

    return pattern.sub(replacer, text)

def process_docs():
    for root, _, files in os.walk(SOURCE_DIR):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                new_content = convert_admonitions(content)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)

if __name__ == "__main__":
    process_docs()
