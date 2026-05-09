export interface CardDef {
	id: string;
	label: string;
}

export interface TeamDef {
	id: string;
	name: string;
	flag: string;
	group: string; // 'A'–'L' or 'Special'
	cards: CardDef[];
}

function makeCards(prefix: string, count: number): CardDef[] {
	return Array.from({ length: count }, (_, i) => {
		const code = `${prefix}${i + 1}`;
		return { id: code, label: code };
	});
}

export const GROUP_ORDER = [
	'Special', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
] as const;

export const TEAMS: TeamDef[] = [
	// ── Special ────────────────────────────────────────────────────────
	{
		id: 'FIFA', name: 'FIFA', flag: '🏆', group: 'Special',
		cards: [
			{ id: 'FIFA00', label: 'FIFA 00' },
			...makeCards('FWC', 19),
		],
	},
	{
		id: 'CC', name: 'Coca-Cola', flag: '🥤', group: 'Special',
		cards: makeCards('CC', 14),
	},

	// ── Group A ────────────────────────────────────────────────────────
	{ id: 'MEX', name: 'Mexico',       flag: '🇲🇽', group: 'A', cards: makeCards('MEX', 20) },
	{ id: 'KOR', name: 'South Korea',  flag: '🇰🇷', group: 'A', cards: makeCards('KOR', 20) },
	{ id: 'RSA', name: 'South Africa', flag: '🇿🇦', group: 'A', cards: makeCards('RSA', 20) },
	{ id: 'CZE', name: 'Czech Republic', flag: '🇨🇿', group: 'A', cards: makeCards('CZE', 20) },

	// ── Group B ────────────────────────────────────────────────────────
	{ id: 'CAN', name: 'Canada',               flag: '🇨🇦', group: 'B', cards: makeCards('CAN', 20) },
	{ id: 'BIH', name: 'Bosnia & Herzegovina', flag: '🇧🇦', group: 'B', cards: makeCards('BIH', 20) },
	{ id: 'QAT', name: 'Qatar',                flag: '🇶🇦', group: 'B', cards: makeCards('QAT', 20) },
	{ id: 'SUI', name: 'Switzerland',          flag: '🇨🇭', group: 'B', cards: makeCards('SUI', 20) },

	// ── Group C ────────────────────────────────────────────────────────
	{ id: 'BRA', name: 'Brazil',   flag: '🇧🇷', group: 'C', cards: makeCards('BRA', 20) },
	{ id: 'MAR', name: 'Morocco',  flag: '🇲🇦', group: 'C', cards: makeCards('MAR', 20) },
	{ id: 'HAI', name: 'Haiti',    flag: '🇭🇹', group: 'C', cards: makeCards('HAI', 20) },
	{ id: 'SCO', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', cards: makeCards('SCO', 20) },

	// ── Group D ────────────────────────────────────────────────────────
	{ id: 'USA', name: 'United States', flag: '🇺🇸', group: 'D', cards: makeCards('USA', 20) },
	{ id: 'PAR', name: 'Paraguay',      flag: '🇵🇾', group: 'D', cards: makeCards('PAR', 20) },
	{ id: 'AUS', name: 'Australia',     flag: '🇦🇺', group: 'D', cards: makeCards('AUS', 20) },
	{ id: 'TUR', name: 'Turkey',        flag: '🇹🇷', group: 'D', cards: makeCards('TUR', 20) },

	// ── Group E ────────────────────────────────────────────────────────
	{ id: 'GER', name: 'Germany',      flag: '🇩🇪', group: 'E', cards: makeCards('GER', 20) },
	{ id: 'ECU', name: 'Ecuador',      flag: '🇪🇨', group: 'E', cards: makeCards('ECU', 20) },
	{ id: 'CIV', name: 'Ivory Coast',  flag: '🇨🇮', group: 'E', cards: makeCards('CIV', 20) },
	{ id: 'CUW', name: 'Curaçao',      flag: '🇨🇼', group: 'E', cards: makeCards('CUW', 20) },

	// ── Group F ────────────────────────────────────────────────────────
	{ id: 'NED', name: 'Netherlands', flag: '🇳🇱', group: 'F', cards: makeCards('NED', 20) },
	{ id: 'JPN', name: 'Japan',       flag: '🇯🇵', group: 'F', cards: makeCards('JPN', 20) },
	{ id: 'SWE', name: 'Sweden',      flag: '🇸🇪', group: 'F', cards: makeCards('SWE', 20) },
	{ id: 'TUN', name: 'Tunisia',     flag: '🇹🇳', group: 'F', cards: makeCards('TUN', 20) },

	// ── Group G ────────────────────────────────────────────────────────
	{ id: 'BEL', name: 'Belgium',     flag: '🇧🇪', group: 'G', cards: makeCards('BEL', 20) },
	{ id: 'IRN', name: 'Iran',        flag: '🇮🇷', group: 'G', cards: makeCards('IRN', 20) },
	{ id: 'EGY', name: 'Egypt',       flag: '🇪🇬', group: 'G', cards: makeCards('EGY', 20) },
	{ id: 'NZL', name: 'New Zealand', flag: '🇳🇿', group: 'G', cards: makeCards('NZL', 20) },

	// ── Group H ────────────────────────────────────────────────────────
	{ id: 'ESP', name: 'Spain',         flag: '🇪🇸', group: 'H', cards: makeCards('ESP', 20) },
	{ id: 'URU', name: 'Uruguay',       flag: '🇺🇾', group: 'H', cards: makeCards('URU', 20) },
	{ id: 'KSA', name: 'Saudi Arabia',  flag: '🇸🇦', group: 'H', cards: makeCards('KSA', 20) },
	{ id: 'CPV', name: 'Cape Verde',    flag: '🇨🇻', group: 'H', cards: makeCards('CPV', 20) },

	// ── Group I ────────────────────────────────────────────────────────
	{ id: 'FRA', name: 'France',   flag: '🇫🇷', group: 'I', cards: makeCards('FRA', 20) },
	{ id: 'SEN', name: 'Senegal',  flag: '🇸🇳', group: 'I', cards: makeCards('SEN', 20) },
	{ id: 'NOR', name: 'Norway',   flag: '🇳🇴', group: 'I', cards: makeCards('NOR', 20) },
	{ id: 'IRQ', name: 'Iraq',     flag: '🇮🇶', group: 'I', cards: makeCards('IRQ', 20) },

	// ── Group J ────────────────────────────────────────────────────────
	{ id: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'J', cards: makeCards('ARG', 20) },
	{ id: 'AUT', name: 'Austria',   flag: '🇦🇹', group: 'J', cards: makeCards('AUT', 20) },
	{ id: 'ALG', name: 'Algeria',   flag: '🇩🇿', group: 'J', cards: makeCards('ALG', 20) },
	{ id: 'JOR', name: 'Jordan',    flag: '🇯🇴', group: 'J', cards: makeCards('JOR', 20) },

	// ── Group K ────────────────────────────────────────────────────────
	{ id: 'POR', name: 'Portugal',   flag: '🇵🇹', group: 'K', cards: makeCards('POR', 20) },
	{ id: 'COL', name: 'Colombia',   flag: '🇨🇴', group: 'K', cards: makeCards('COL', 20) },
	{ id: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', group: 'K', cards: makeCards('UZB', 20) },
	{ id: 'COD', name: 'DR Congo',   flag: '🇨🇩', group: 'K', cards: makeCards('COD', 20) },

	// ── Group L ────────────────────────────────────────────────────────
	{ id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', cards: makeCards('ENG', 20) },
	{ id: 'CRO', name: 'Croatia', flag: '🇭🇷', group: 'L', cards: makeCards('CRO', 20) },
	{ id: 'PAN', name: 'Panama',  flag: '🇵🇦', group: 'L', cards: makeCards('PAN', 20) },
	{ id: 'GHA', name: 'Ghana',   flag: '🇬🇭', group: 'L', cards: makeCards('GHA', 20) },
];
