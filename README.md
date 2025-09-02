# Obsidian AI Agent

https://github.com/user-attachments/assets/3b251604-cf52-4f38-8c9d-fba67e280b64

Bring AI agents directly into your Obsidian vault. This plugin integrates AI agent CLIs (currently Claude Code) seamlessly with Obsidian - allowing you to chat with AI, edit files, and manage your knowledge base without leaving your workspace.

## Why?

Working with AI shouldn't break your flow or lose context about your vault. 

This plugin aims to keep Claude context-aware of your Obsidian environment while letting you stay in your workspace instead of switching to terminal. It also has some magics 🪄  to help you manage context more effectively.

See the [roadmap](#roadmap) for upcoming features I'm looking to incorporate.

## Features

- **Direct AI integration**: Chat with Claude Code directly in Obsidian's interface
- **File-first approach**: AI agents can read, edit, and create files in your vault
- **Context-aware**: Automatically includes relevant vault context in conversations
- **Real-time collaboration**: See AI edits happen live in your Obsidian interface
- **"Bash is all you need" + "files over apps" = <3**: Claude's "bash is all you need" philosophy aligns perfectly with Obsidian's "files over apps" approach — no proprietary formats or magics, just direct file editing

## Installation

### Prerequisites
- **Node.js** - Required for plugin execution
- **Claude Code CLI** - Get it from [Anthropic's Claude Code](https://www.anthropic.com/claude-code)

### Setup

*Coming soon to the Obsidian community plugin store*

1. **Verify CLI access**: Ensure you can run `claude` in your terminal
2. **Download**: Get the latest release (`obsidian-ai-agent.zip`) from the [releases page](../../releases)
3. **Install**: Extract from the `obsidian-ai-agent.zip` and place the folder in `[your_vault]/.obsidian/plugins/obsidian-ai-agent`
4. **Enable**: Activate the plugin in Obsidian's Community Plugins settings
5. **Start chatting**: Use the AI Agent panel in your workspace right-sidebar

> [!WARNING]
> **Preview version notice**
> 
> This plugin is in active development and will modify files in your vault. It currently uses elevated permissions (`--permission-mode bypassPermissions` and `dangerously-skip-permissions`) for full functionality. 
> 
> **Recommended**: Back up your vault before use. Fine-grained permission controls are planned for future releases.

## Troubleshooting

### CLI issues
**Can't find Node.js or Claude CLI?**

1. **Verify installations**: Run `node --version` and `claude --version` in your terminal
2. **Manual configuration**: If auto-detection fails, set paths manually in **Settings > Community Plugins > Obsidian AI Agent**

**Find executable paths:**
```bash
# Node.js location
which node

# Claude CLI location
echo "$(sed -n 's/^exec "\([^"]*\)".*/\1/p' $(which claude))"
```

**Windows users**: Claude must be installed in WSL. Windows support is still being tested.

### Debug mode
**Enable detailed logging:**
1. Go to **Settings > Community Plugins > Obsidian AI Agent**
2. Enable "Debugging" to see detailed logs
3. Open Developer Console: `Cmd+Opt+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux)

## Roadmap

### Core features
- [ ] **Model selection** - Choose between different Claude models
- [ ] **Interaction modes** - Write mode, plan mode, and custom workflows
- [ ] **Custom system messages** - Personalize AI behavior for your use case
- [ ] **Permission controls** - Fine-grained file access and editing permissions
- [ ] **Cross-platform support** - Enhanced Windows/WSL compatibility

### Obsidian integration
- [ ] **Context menu integration** - "Add to AI context" from file explorer
- [ ] **File linking** - Open the files that were read/edited by your model
- [ ] **Selection-based context** - Include selected text in conversations
- [ ] **Enhanced copy/paste** - Smart context copy/paste (similar to Cursor)
- [ ] **Quick commands** - Quick commands for sending re-usable context to your AI
