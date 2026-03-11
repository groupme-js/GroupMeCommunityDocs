---
title: "Contributing to the Docs"
description: "Learn how you can contribute to and help improve the GroupMe Community API documentation."
---

# Contributing to the Documentation

Thank you for your interest in contributing! This project is a community effort, and we're thrilled to have you here. Whether you're fixing a typo, documenting a new endpoint, or correcting an error, every contribution helps create a better resource for all GroupMe API developers.

This guide will walk you through the process of contributing.

***

## How Can I Contribute?

There are many ways to contribute, and not all of them require writing code or documentation yourself.

*   **🐛 Reporting Issues:** Find a typo, a broken link, or information that seems incorrect or outdated? The best way to let us know is by [opening an issue](https://github.com/groupme-js/GroupMeCommunityDocs/issues) on our GitHub repository.
*   **✍️ Editing and Improving Content:** You can help by clarifying confusing sentences, adding more detailed explanations, or correcting inaccuracies directly.
*   **✨ Adding New Content:** If you've discovered a new API endpoint, an undocumented event type, or a hidden parameter, you can help by adding a new page or section.
*   **💡 Suggesting Enhancements:** Have an idea for how to make the documentation better? Maybe a new example bot, a different page structure, or a better explanation of a core concept? Feel free to open an issue to discuss your ideas.

***

## Submitting a Change (Pull Requests)

For those who want to directly edit or add content, we use the standard GitHub **Fork & Pull Request** workflow. If you've never contributed to an open-source project before, don't worry! Here's a step-by-step guide.

***

### Step 1: Fork the Repository

First, you need to create your own copy of the repository. Go to the [main repository page](https://github.com/groupme-js/GroupMeCommunityDocs) and click the **"Fork"** button in the top-right corner. This will create a copy under your own GitHub account.

***

### Step 2: Clone Your Fork

Next, clone your forked repository to your local machine so you can make changes.

```bash
git clone https://github.com/YOUR_USERNAME/GroupMeCommunityDocs.git
cd GroupMeCommunityDocs
```

***

### Step 3: Create a New Branch

It's best practice to make your changes in a new branch instead of the `main` branch. This keeps your work organized. Choose a descriptive name for your branch.

```bash
# For a bug fix or correction
git checkout -b fix/correct-reactions-endpoint

# For a new feature or page
git checkout -b feat/document-calendar-api
```

***

### Step 4: Make Your Changes

Now you're ready to make your changes! Open the project in your favorite text editor (like VS Code) and start editing the Markdown (`.md`) files in the `docs/` directory.

Make sure to follow the existing style and structure of the documentation. This is laid out in our [Style Guide](styleguide.md), but if you have any questions please reach out *before* making your change. Here are some key points to remember:

*   Use clear, concise language.
*   Use code blocks for examples, specifying the language (e.g., `json`, `bash`, `js`).
*   Use admonitions (like `!!! note`, `!!! warning`, `!!! tip`) to highlight important information.
*   Use headings and subheadings to structure your content clearly.
*   If you're documenting an API endpoint, include the HTTP method and path, and provide example requests and responses. Refer to existing endpoint documentation for examples.

```markdown

!!! note
    
    We use a special flavor of Markdown that supports additional features like admonitions and special UI elements. You can dind its reference in the [Material for MKDocs Reference Guide](https://squidfunk.github.io/mkdocs-material/reference/)

```


#### Linting and Typo Checking

This project uses [codespell](https://github.com/codespell-project/codespell) to catch common typos before they make it into the documentation. We recommend setting up [pre-commit](https://pre-commit.com/) to automatically check for typos before each commit.

**Installing pre-commit:**

```bash
pip install pre-commit
pre-commit install
```

After running these commands, codespell will automatically check your changes for typos every time you commit. If typos are found, the commit will be blocked until you fix them.

**Fixing typos:**

If codespell finds a typo, it will show you the file, line number, and suggest corrections:

```
docs/api/groups/index.md:123: receive ==> receive
```

Simply open the file, navigate to the line, and fix the typo. Then stage your changes and commit again.

**Running the check manually:**

You can also run the typo check manually at any time:

```bash
pre-commit run --all-files
```

Or run codespell directly:

```bash
pip install codespell
codespell docs/
```

If codespell flags a word that is intentionally spelled that way (like a technical term or API field name), you can add it to the ignore list in `.pre-commit-config.yaml`.

***

### Step 5: Commit Your Changes

Once you're happy with your changes, commit them with a clear and descriptive message. 

```bash
# Example commit
git commit -m "docs: clarify the difference between reply_id and base_reply_id"
```

***

### Step 6: Push Your Changes

Push your new branch and its commits to your fork on GitHub.

```bash
git push origin fix/correct-reactions-endpoint
```

***

### Step 7: Open a Pull Request

Go back to your fork on GitHub. You should see a prompt to **"Compare & pull request"**. Click it, and it will take you to a new page.

*   Give your pull request a clear title.
*   In the description, explain **what** you changed and **why**.
*   Click **"Create pull request"**.

That's it! A project maintainer will review your changes, provide feedback if needed, and merge it once it's ready.

Thank you again for your contribution!

***

By submitting a pull request, you agree to license your contribution under the respective licenses of this project as described in our [license](./licensing.md).

***