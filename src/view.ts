import { App, ItemView, Modal, Setting, WorkspaceLeaf } from 'obsidian';
import { CardDef, TEAMS, TeamDef, GROUP_ORDER } from './data';
import type WorldCupCardsPlugin from './main';

export const VIEW_TYPE_WCC = 'wcc-view';

function asciiBar(filled: number, total: number, width = 12): string {
	if (total === 0) return `[${'░'.repeat(width)}]`;
	const n = Math.round((filled / total) * width);
	return `[${'█'.repeat(n)}${'░'.repeat(width - n)}]`;
}

function cardStar(count: number): string {
	if (count === 0) return '[ ]';
	if (count === 1) return '[x]';
	return `[${count}]`;
}

export class WorldCupCardsView extends ItemView {
	plugin: WorldCupCardsPlugin;
	expandedGroups: Set<string> = new Set();
	expandedTeams: Set<string> = new Set();
	searchQuery = '';
	filterMode: 'all' | 'missing' | 'duplicates' = 'all';
	private restoreSearchFocus = false;

	constructor(leaf: WorkspaceLeaf, plugin: WorldCupCardsPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType() { return VIEW_TYPE_WCC; }
	getDisplayText() { return 'World cup 2026 cards'; }
	getIcon() { return 'trophy'; }

	onOpen(): Promise<void> { this.render(); return Promise.resolve(); }
	onClose(): Promise<void> { this.contentEl.empty(); return Promise.resolve(); }

	private groupLabel(group: string): string {
		return group === 'Special' ? '[ SPECIAL ]' : `[ GROUP ${group} ]`;
	}

	private cardIsVisible(card: CardDef, team: TeamDef): boolean {
		if (this.searchQuery) {
			const q = this.searchQuery;
			const ok = card.id.toLowerCase().includes(q)
				|| card.label.toLowerCase().includes(q)
				|| team.name.toLowerCase().includes(q)
				|| team.id.toLowerCase().includes(q);
			if (!ok) return false;
		}
		const count = this.plugin.data[card.id] ?? 0;
		if (this.filterMode === 'missing')    return count === 0;
		if (this.filterMode === 'duplicates') return count > 1;
		return true;
	}

	render() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('wcc-container');

		const totalCards    = TEAMS.reduce((s, t) => s + t.cards.length, 0);
		const collectedCards = TEAMS.reduce(
			(s, t) => s + t.cards.filter(c => (this.plugin.data[c.id] ?? 0) >= 1).length, 0
		);

		// ── Header ──────────────────────────────────────────
		const header = contentEl.createDiv('wcc-header');
		header.createEl('h2', { text: 'FIFA World Cup 2026 // cards' });
		const overallRow = header.createDiv('wcc-overall-row');
		overallRow.createSpan({ text: asciiBar(collectedCards, totalCards, 20), cls: 'wcc-ascii-bar' });
		overallRow.createSpan({ text: ` ${collectedCards}/${totalCards}`, cls: 'wcc-overall-label' });

		// ── Search ──────────────────────────────────────────
		const searchInput = header.createEl('input', {
			cls: 'wcc-search',
			attr: { type: 'text', placeholder: '> search by country or card number...' },
		});
		searchInput.value = this.searchQuery;
		searchInput.addEventListener('input', () => {
			this.searchQuery = searchInput.value.trim().toLowerCase();
			this.restoreSearchFocus = true;
			this.render();
		});
		if (this.restoreSearchFocus) {
			this.restoreSearchFocus = false;
			setTimeout(() => {
				searchInput.focus();
				searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
			}, 0);
		}

		// ── Filter buttons ───────────────────────────────────
		const filterBar = header.createDiv('wcc-filter-bar');
		for (const [mode, label] of [
			['all',        'ALL'],
			['missing',    'MISSING'],
			['duplicates', 'DUPLICATES'],
		] as const) {
			const btn = filterBar.createEl('button', {
				text: label,
				cls: `wcc-filter-btn${this.filterMode === mode ? ' active' : ''}`,
			});
			btn.addEventListener('click', () => {
				this.filterMode = this.filterMode === mode ? 'all' : mode;
				this.render();
			});
		}

		// ── Groups ──────────────────────────────────────────
		const isFiltering = this.searchQuery.length > 0 || this.filterMode !== 'all';

		const byGroup = new Map<string, TeamDef[]>();
		for (const team of TEAMS) {
			if (!byGroup.has(team.group)) byGroup.set(team.group, []);
			byGroup.get(team.group)!.push(team);
		}

		for (const group of GROUP_ORDER) {
			const allTeams = byGroup.get(group);
			if (!allTeams) continue;

			const visibleTeams = isFiltering
				? allTeams.filter(t => t.cards.some(c => this.cardIsVisible(c, t)))
				: allTeams;

			if (isFiltering && visibleTeams.length === 0) continue;

			const groupTotal     = allTeams.reduce((s, t) => s + t.cards.length, 0);
			const groupCollected = allTeams.reduce(
				(s, t) => s + t.cards.filter(c => (this.plugin.data[c.id] ?? 0) >= 1).length, 0
			);

			const section       = contentEl.createDiv(`wcc-section wcc-group-${group.toLowerCase()}`);
			const sectionHeader = section.createDiv('wcc-section-header');
			const isOpen        = isFiltering || this.expandedGroups.has(group);

			sectionHeader.createSpan({ text: isOpen ? '[-]' : '[+]', cls: 'wcc-chevron' });
			sectionHeader.createSpan({ text: this.groupLabel(group), cls: 'wcc-group-name' });
			sectionHeader.createSpan({ text: `${groupCollected}/${groupTotal}`, cls: 'wcc-group-count' });

			sectionHeader.addEventListener('click', () => {
				if (isFiltering) return;
				if (this.expandedGroups.has(group)) this.expandedGroups.delete(group);
				else this.expandedGroups.add(group);
				this.render();
			});

			if (isOpen) {
				const teamsEl = section.createDiv('wcc-teams');
				for (const team of visibleTeams) {
					const filteredCards = isFiltering
						? team.cards.filter(c => this.cardIsVisible(c, team))
						: null;
					this.renderTeam(teamsEl, team, filteredCards);
				}
			}
		}

		// ── Footer ──────────────────────────────────────────
		const footer = contentEl.createDiv('wcc-footer');
		footer.createSpan({ text: `v${this.plugin.manifest.version}`, cls: 'wcc-version' });
	}

	renderTeam(parent: HTMLElement, team: TeamDef, filteredCards: CardDef[] | null = null) {
		const teamCollected = team.cards.filter(c => (this.plugin.data[c.id] ?? 0) >= 1).length;
		const teamTotal     = team.cards.length;
		const isOpen        = filteredCards !== null || this.expandedTeams.has(team.id);
		const isComplete    = teamCollected === teamTotal;

		const teamEl     = parent.createDiv('wcc-team');
		const teamHeader = teamEl.createDiv(`wcc-team-header${isComplete ? ' complete' : ''}`);
		teamHeader.createSpan({ text: team.flag, cls: 'wcc-flag' });
		teamHeader.createSpan({ text: team.name, cls: 'wcc-team-name' });

		const progressWrap = teamHeader.createDiv('wcc-team-progress');
		progressWrap.createSpan({ text: asciiBar(teamCollected, teamTotal, 10), cls: 'wcc-ascii-bar' });
		progressWrap.createSpan({ text: ` ${teamCollected}/${teamTotal}`, cls: 'wcc-team-count' });

		teamHeader.addEventListener('click', () => {
			if (filteredCards !== null) return;
			if (this.expandedTeams.has(team.id)) this.expandedTeams.delete(team.id);
			else this.expandedTeams.add(team.id);
			this.render();
		});

		const cards = filteredCards ?? (isOpen ? team.cards : null);
		if (!cards) return;

		const cardsGrid = teamEl.createDiv('wcc-cards');
		for (const card of cards) {
			const count     = this.plugin.data[card.id] ?? 0;
			const collected = count >= 1;
			const hasDupes  = count > 1;

			const cardEl = cardsGrid.createDiv(
				`wcc-card${collected ? ' collected' : ''}${hasDupes ? ' has-dupes' : ''}`
			);
			cardEl.createSpan({ text: cardStar(count), cls: 'wcc-card-star' });
			cardEl.createSpan({ text: card.label,      cls: 'wcc-card-label' });

			const openEditor = () => {
				new CardCountModal(this.app, this.plugin.data[card.id] ?? 0, card.label, async (n) => {
					this.plugin.data[card.id] = Math.max(0, n);
					await this.plugin.savePluginData();
					this.render();
				}).open();
			};

			let holdTimer: number | undefined;
			let startX = 0, startY = 0;

			cardEl.addEventListener('pointerdown', (e) => {
				e.preventDefault();
				startX = e.clientX;
				startY = e.clientY;
				holdTimer = window.setTimeout(() => { holdTimer = undefined; openEditor(); }, 500);
			});

			const cancelHold = () => {
				if (holdTimer !== undefined) { clearTimeout(holdTimer); holdTimer = undefined; }
			};

			cardEl.addEventListener('pointerup', () => {
				if (holdTimer === undefined) return;
				cancelHold();
				const cur = this.plugin.data[card.id] ?? 0;
				if (cur > 1) { openEditor(); return; }
				this.plugin.data[card.id] = cur === 0 ? 1 : 0;
				void this.plugin.savePluginData();
				this.render();
			});
			cardEl.addEventListener('pointercancel', cancelHold);
			cardEl.addEventListener('pointermove', (e) => {
				if (Math.hypot(e.clientX - startX, e.clientY - startY) > 10) cancelHold();
			});
		}
	}
}

class CardCountModal extends Modal {
	private count: number;

	constructor(
		app: App,
		count: number,
		private label: string,
		private onSave: (n: number) => Promise<void>,
	) {
		super(app);
		this.count = count;
	}

	onOpen() {
		this.setTitle(`${this.label} -- copies`);

		new Setting(this.contentEl)
			.setName('How many do you have?')
			.addText(text => {
				text.inputEl.type = 'number';
				text.inputEl.min  = '0';
				text.setValue(String(this.count));
				text.onChange(v => {
					const n = parseInt(v);
					if (!isNaN(n) && n >= 0) this.count = n;
				});
				setTimeout(() => { text.inputEl.focus(); text.inputEl.select(); }, 50);
			});

		new Setting(this.contentEl)
			.addButton(btn => btn
				.setButtonText('Save')
				.setCta()
				.onClick(async () => { await this.onSave(this.count); this.close(); })
			);
	}

	onClose() { this.contentEl.empty(); }
}
