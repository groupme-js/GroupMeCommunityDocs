---
title: "Documentation Style Guide"
description: "Guidelines and best practices for contributing to the GroupMe Community API documentation."
---

# Documentation Style Guide

Welcome, contributor! To ensure our documentation is clear, consistent, and easy to navigate, we've established this set of style guidelines. Following these standards will help everyone, from first-time readers to experienced developers, get the most out of this resource.

***

## General Philosophy

*   **Clarity is Key:** Write for a technical audience, but don't assume they know everything about the GroupMe API. Explain GroupMe-specific concepts clearly.
*   **Be Direct:** Use a professional and informative tone. Get straight to the point.
*   **Show, Don't Just Tell:** Every endpoint should be accompanied by clear request and response examples.

***

## Page Structure

Every documentation page should follow a consistent structure.

### 1. YAML Frontmatter

All pages must begin with a YAML frontmatter block. This provides metadata for the page. At a minimum, include a `title` and a `description`.

```yaml
---
title: "Page Title"
description: "A brief, one-sentence summary of the page's content."
---
```

***

### 2. Page Title

The first element after the frontmatter must be a Level 1 Heading (`#`) that matches the `title` from the frontmatter.

```markdown
# Page Title
```

***

### 3. API Boilerplate (For Endpoint Docs)

For pages documenting API endpoints, include the standard boilerplate introduction immediately after the title. This sets the context for all subsequent requests. Use a horizontal rule (`***`) to separate it from the main content.

```markdown
Unless otherwise stated, endpoints are relative to `https://api.groupme.com/v3/` and must include the token of the user making the call - so, for example, if an endpoint is `GET /groups`, the request you make should be using the URL `https://api.groupme.com/v3/groups?token=aSDFghJkl`, where `aSDFghJkl` is replaced with the user's token.

URLs which include a variable, such as `GET /groups/:id`, have their variables marked with a colon. So a request to that endpoint would look like `https://api.groupme.com/v3/groups/1234567?token=aSDFghJkl`, where `1234567` is replaced with the group's ID, and `aSDFghJkl` is replaced with the user's token.

Finally, all responses are wrapped in a response envelope of the following form:

````json linenums="1"
{
  "response": {
    "id": "12345",
    "name": "Family"
    ...
  },
  "meta": {
    "code": 200,
    "errors": []
  }
}
````

If the request succeeds, `meta.errors` will be null, and if the request fails, `response` will be null.

***
```

***

## Content Formatting

### Headings and Sections

*   **`# Heading 1`**: Only for the main page title.
*   **`## Heading 2`**: For major sections, typically a single API endpoint (e.g., "Create a poll", "Index Members").
*   **`***` (Horizontal Rule)**: Use a horizontal rule to separate each major endpoint section (`##`).

***

### Code Blocks

Code blocks are essential for showing examples. Use the following format for consistency:

````markdown
```json linenums="1" title="HTTP Request"
GET /groups/:group_id/messages
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "count": 123,
  "messages": []
}
```````

*   **Language:** Always specify the language (`json`, `js`, `bash`, etc.).
*   **Line Numbers:** Use `linenums="1"` to enable line numbering.
*   **Title:** Provide a `title` that describes the block (e.g., "HTTP Request", "HTTP Response", "Object Structure").
*   **Status Codes:** For `HTTP Response` blocks, include the status line (e.g., `Status: 200 OK`) as the first line.
*   **Indentation** We use 2 spaces for indentation in code blocks, not tabs. This ensures consistent formatting across different editors and viewers.

***

### Parameter Lists

When describing parameters for an endpoint, use a bulleted list.

*   **Bold** the `Parameters` heading.
*   Italicize the parameter name (`*parameter_name*`).
*   Follow with the parameter's type (`string`, `boolean`, `array`, etc.) and a brief description.
*   Indicate if a parameter is `(required)` or `(optional)`.

**Example:**

```markdown
**Parameters**

* *group_id* (required)

	string - The ID of the group where the event is located.
	
* *limit* (optional)

	integer - The number of results to pull. Defaults to 20.
```

### Text Formatting

*   Use `**bold**` for emphasis on headings within text, such as **Parameters**.
*   Use `*italic*` for parameter names and for gentle emphasis on a word.
*   Use `` `inline code` `` for:
    *   Endpoint paths: `` `/users/me` ``
    *   Variable names: `source_guid`
    *   Literal values: `true`, `"image"`, `null`

***

### Callouts (Admonitions)

Use callouts to highlight important information.

*   `!!! note`: For helpful, non-critical information or tips.
    ```markdown
    !!! note
        This call is limited to admins and owners in the group.
    ```

    !!! note
        This call is limited to admins and owners in the group.

*   `!!! warning`: For non-breaking but important warnings users must be aware of.
    ```markdown
    !!! warning "Breaking Change: Device Verification"
        This endpoint now requires platform-level device verification...
    ```

    !!! warning "Breaking Change: Device Verification"
        This endpoint now requires platform-level device verification...

*   `!!! important`: For critical information that might otherwise be missed, especially regarding API versions.
    ```markdown
    !!! important
        This request is relative to `https://api.groupme.com/v4/`, not `https://api.groupme.com/v3/`.
    ```

    !!! important
        This request is relative to `https://api.groupme.com/v4/`, not `https://api.groupme.com/v3/`.

***

Thank you for helping us keep the documentation clean and consistent!

***