import { Plugin, WorkspaceLeaf } from 'obsidian';
import { AIChatView, VIEW_TYPE_AI_CHAT } from './ChatView';
import { AIChatSettingTab } from './SettingsTab';
import { AIChatSettings, DEFAULT_SETTINGS } from './types';

export default class AIChatPlugin extends Plugin {
	settings: AIChatSettings;

	async onload() {
		await this.loadSettings();

		// Register the custom view
		this.registerView(
			VIEW_TYPE_AI_CHAT,
			(leaf) => new AIChatView(leaf, this.settings)
		);

		// Open the view in the right sidebar by default
		if (this.app.workspace.layoutReady) {
			await this.activateView();
		} else {
			this.app.workspace.onLayoutReady(async () => {
				await this.activateView();
			});
		}


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new AIChatSettingTab(this.app, this));
	}

	onunload() {
		// Detach leaves with our view type when unloading
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_AI_CHAT);
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_AI_CHAT);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use it
			leaf = leaves[0];
		} else {
			// Our view doesn't exist, create a new leaf in the right sidebar
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({ type: VIEW_TYPE_AI_CHAT, active: true });
			}
		}

		// Reveal the leaf in case it's hidden
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
