import os
import re

SOURCE_DIR = "docs"

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
        body = match.group(2).strip()

        label = ADMONITION_MAP.get(raw_label)
        if not label:
            return match.group(0)

        lines = [line[2:] for line in body.splitlines() if line.startswith("> ")]
        title = ""
        if lines:
            first_line = lines[0].strip()
            bold_match = re.match(r"\*\*(.+?)\*\*", first_line)
            if bold_match:
                title = bold_match.group(1)
                lines = lines[1:]  # remove title line from body

        body_text = "\n".join(f"    {line}" for line in lines)
        if title:
            return f'!!! {label} "{title}"\n{body_text}'
        else:
            return f'!!! {label}\n{body_text}'


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
