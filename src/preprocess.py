import os
import shutil
import re

SOURCE_DIR = "docs"
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

def rename_readme_to_index(filename):
    if filename.lower() == "readme.md":
        return "index.md"
    return filename

def move_and_process_markdown_files():
    os.makedirs(SOURCE_DIR, exist_ok=True)

    for file in os.listdir(ROOT_DIR):
        full_path = os.path.join(ROOT_DIR, file)

        if (
            os.path.isfile(full_path)
            and file.endswith(".md")
            and file.lower() != "readme.md"
            and not full_path.startswith(SOURCE_DIR)
        ):
            target_path = os.path.join(SOURCE_DIR, file)
            shutil.move(full_path, target_path)
            print(f"Moved: {file} → {SOURCE_DIR}/")

    readme_path = os.path.join(ROOT_DIR, "readme.md")
    index_path = os.path.join(SOURCE_DIR, "index.md")
    if os.path.exists(readme_path) and not os.path.exists(index_path):
        shutil.move(readme_path, index_path)
        print("Renamed and moved: readme.md → docs/index.md")

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
    move_and_process_markdown_files()
    process_docs()
