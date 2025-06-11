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
        block = match.group(2)

        label = ADMONITION_MAP.get(raw_label)
        if not label:
            return match.group(0)

        # Preserve all lines including blank ones
        raw_lines = []
        for line in block.splitlines():
            if line.startswith("> "):
                raw_lines.append(line[2:])
            elif line.strip() == ">":
                raw_lines.append("")
        
        # Clean leading/trailing blank lines
        while raw_lines and raw_lines[0].strip() == "":
            raw_lines.pop(0)
        while raw_lines and raw_lines[-1].strip() == "":
            raw_lines.pop()

        # Check if first line is a title
        title = ""
        if raw_lines and re.match(r"\*\*(.+?)\*\*", raw_lines[0].strip()):
            title = re.match(r"\*\*(.+?)\*\*", raw_lines[0].strip()).group(1)
            raw_lines = raw_lines[1:]  # remove title line

            # Remove blank line directly after title
            if raw_lines and raw_lines[0].strip() == "":
                raw_lines.pop(0)

        # Indent the rest
        content = "\n".join(f"    {line}" for line in raw_lines)

        return f'!!! {label} "{title}"\n{content}' if title else f'!!! {label}\n{content}'



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
