import { Plugin } from 'obsidian';
import { VIEW_TYPE_WCC, WorldCupCardsView } from './view';

export default class WorldCupCardsPlugin extends Plugin {
	data: Record<string, number> = {};

	async onload() {
		await this.loadPluginData();

		this.registerView(VIEW_TYPE_WCC, (leaf) => new WorldCupCardsView(leaf, this));

		this.addRibbonIcon('trophy', 'World Cup 2026 Cards', () => {
			this.activateView();
		});

		this.addCommand({
			id: 'open-wcc',
			name: 'Open World Cup 2026 Cards',
			callback: () => this.activateView(),
		});
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_WCC);
	}

	async activateView() {
		const { workspace } = this.app;
		let leaf = workspace.getLeavesOfType(VIEW_TYPE_WCC)[0];
		if (!leaf) {
			leaf = workspace.getLeaf('tab');
			await leaf.setViewState({ type: VIEW_TYPE_WCC, active: true });
		}
		workspace.revealLeaf(leaf);
	}

	async loadPluginData() {
		const raw = (await this.loadData()) as Record<string, boolean | number> | null ?? {};
		this.data = Object.fromEntries(
			Object.entries(raw).map(([k, v]) => [k, typeof v === 'boolean' ? (v ? 1 : 0) : v])
		);
	}

	async savePluginData() {
		await this.saveData(this.data);
	}
}
