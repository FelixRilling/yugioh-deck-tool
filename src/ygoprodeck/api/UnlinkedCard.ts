import type {
	CardImage,
	CardPrices,
	Format,
	ReleaseInfo,
	BanlistInfo,
} from "@/core/lib";

/**
 * @see CardLinkingService
 */
export interface CardSetAppearance {
	readonly name: string;
	readonly code: string;
}

/**
 * Version of Card without references to {@link CardType} or {@link CardSet}.
 *
 * @see Card
 * @see CardLinkingService
 */
export interface UnlinkedCard {
	readonly passcode: string;
	readonly name: string;
	readonly description: string;

	readonly type: string;
	readonly subType: string;

	readonly attribute: string | null;
	readonly atk: number | null;
	readonly def: number | null;
	readonly level: number | null;
	readonly pendulumScale: number | null;
	readonly linkRating: number | null;
	readonly linkMarkers: string[] | null;

	readonly betaName: string | null;
	readonly treatedAs: string | null;
	readonly archetype: string | null;

	readonly release: ReleaseInfo;
	readonly sets: CardSetAppearance[];
	readonly formats: Format[];
	readonly banlist: BanlistInfo;

	readonly image: CardImage | null;
	readonly prices: CardPrices;
	readonly views: number;
	readonly quantity: number | null; // Number when querying collection, null otherwise
}
