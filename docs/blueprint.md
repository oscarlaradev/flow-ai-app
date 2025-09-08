# **App Name**: FlowAI

## Core Features:

- Flowchart Generation from Text: Automatically generate a flowchart diagram based on a simple, human-readable text input format.
- AI Syntax Suggestion Tool: The app will proactively offer real-time suggestions for how to describe flowcharts using simple text. The AI will act as a tool for improving and correcting syntax in the textarea.
- Interactive Diagram Visualization: Display the generated flowchart as an interactive SVG diagram, with pan and zoom capabilities.
- Simple Text Editor: A basic text editor (like a textarea) for inputting the flowchart description.
- Syntax Highlighting: Highlighting of key syntax elements in the textarea to improve readability of the simple flowchart "language."
- Export to Image: Allow the user to export the diagram as a PNG or JPG.
- Example flows: Include some examples in a pulldown to help the user get familiar with the syntax. These can be stored directly in the Javascript code for the application. Example flows include a purchase flow, login flow, error handling flow etc.

## Style Guidelines:

- Primary color: Dark slate blue (#434A54), providing a professional and modern feel. (#434A54 to RGB)
- Background color: Dark gray (#2E3137), complementing the primary color and creating a high contrast. (#2E3137 to RGB)
- Accent color: Teal (#008080), used for interactive elements and highlights. (#008080 to RGB)
- Font: 'Inter', sans-serif, for both headers and body text, to provide a clear and readable experience.
- Code font: 'Source Code Pro' for displaying code snippets in the syntax help area.
- Minimalist icons for actions like 'generate,' 'export,' and potentially for different node types (process, decision, etc.).
- Two-panel layout: editor on the left, interactive diagram on the right.  Use a dark theme for the background and the panels.
- Subtle transitions when generating or updating the diagram. For example, the nodes could fade in smoothly on first render.