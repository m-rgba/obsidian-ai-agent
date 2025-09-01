import { App, PluginSettingTab, Setting } from 'obsidian';
import type AIChatPlugin from './main';

export class AIChatSettingTab extends PluginSettingTab {
	plugin: AIChatPlugin;

	constructor(app: App, plugin: AIChatPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		
		new Setting(containerEl)
			.setName('Node.js location')
			.setDesc('Path to Node.js executable. Leave empty to auto-detect.')
			.addText(text => text
				.setPlaceholder('Auto-detect (e.g., /usr/local/bin/node)')
				.setValue(this.plugin.settings.nodeLocation || '')
				.onChange(async (value) => {
					this.plugin.settings.nodeLocation = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Claude Code location')
			.setDesc('Path to Claude Code executable. Leave empty to auto-detect.')
			.addText(text => text
				.setPlaceholder('Auto-detect (e.g., ~/.claude/local/node_modules/.bin/claude)')
				.setValue(this.plugin.settings.claudeLocation || '')
				.onChange(async (value) => {
					this.plugin.settings.claudeLocation = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Debug context')
			.setDesc('Enable debug logging for troubleshooting (logs to console).')
			.addDropdown(dropdown => dropdown
				.addOption('false', 'Disabled')
				.addOption('true', 'Enabled')
				.setValue(String(this.plugin.settings.debugContext || false))
				.onChange(async (value) => {
					this.plugin.settings.debugContext = value === 'true';
					await this.plugin.saveSettings();
				}));

	}
}