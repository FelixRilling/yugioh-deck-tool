import type { Card, PriceService } from "@yugioh-deck-tool/core";
import {
	CardTypeCategory,
	DEFAULT_VENDOR_ARR,
	Format,
	TYPES,
} from "@yugioh-deck-tool/core";
import { tooltipContainer } from "../inversify.config";
import {
	createDiv,
	createImg,
	createLi,
	createParagraph,
	createSpan,
	createUl,
} from "./domHelper";
import type { ResourceService } from "@yugioh-deck-tool/ygoprodeck";
import { YGOPRODECK_TYPES } from "@yugioh-deck-tool/ygoprodeck";

const priceService = tooltipContainer.get<PriceService>(TYPES.PriceService);
const resourceService = tooltipContainer.get<ResourceService>(
	YGOPRODECK_TYPES.ResourceService
);

export const createLoadingTooltip = (): HTMLElement =>
	createDiv(
		["card-tooltip__content", "card-tooltip__content--loading"],
		[
			createDiv(
				["card-tooltip__loading"],
				[
					createSpan(["fas", "fa-spinner", "fa-spin"], ""),
					createSpan([], "Loading..."),
				]
			),
		]
	);

const createMonsterStats = (card: Card): HTMLElement => {
	const statsChildren: HTMLElement[] = [];
	const statImage = createImg([], resourceService.getAtkImageUrl(), {
		hidden: true,
		alt: "ATK",
	});
	statsChildren.push(statImage);
	if (card.atk != null) {
		statsChildren.push(createSpan([], `ATK/ ${card.atk}`));
	}
	if (card.def != null) {
		statsChildren.push(createSpan([], `DEF/ ${card.def}`));
	} else if (card.linkRating != null) {
		statsChildren.push(createSpan([], `LINK-${card.linkRating}`));
	}
	return createDiv(["card-tooltip__stats"], statsChildren);
};

const createSubType = (card: Card): HTMLElement => {
	const subTypeChildren: HTMLElement[] = [];

	if (card.type.category === CardTypeCategory.MONSTER) {
		subTypeChildren.push(
			createImg([], resourceService.getAttributeImageUrl(card), {
				hidden: true,
				alt: "Attribute",
			})
		);
		subTypeChildren.push(createSpan([], `Attribute: ${card.attribute!}`));
	}
	subTypeChildren.push(
		createImg([], resourceService.getSubTypeImageUrl(card), {
			hidden: true,
			alt: "type",
		})
	);
	subTypeChildren.push(createSpan([], `Type: ${card.subType}`));

	return createDiv(["card-tooltip__subtype"], subTypeChildren);
};

const createPrice = (card: Card): HTMLElement => {
	const priceItems: HTMLElement[] = [];
	for (const vendor of DEFAULT_VENDOR_ARR) {
		const lookupResult = priceService.getPrice([card], vendor);
		if (lookupResult.missing.length > 0) {
			continue;
		}
		const priceItem = createLi(
			[
				"card-tooltip__price__vendor",
				`card-tooltip__price__vendor--${vendor.id}`,
			],
			`${vendor.name}: ${priceService.formatPrice(
				lookupResult.price,
				vendor.currency
			)}`
		);
		priceItems.push(priceItem);
	}
	return createUl(["card-tooltip__price"], priceItems);
};

const createDescription = (card: Card): HTMLElement =>
	createDiv(
		["card-tooltip__description"],
		card.description
			.split("\n")
			.map((paragraph) => createParagraph([], paragraph))
	);

const createCardDetailsCol = (card: Card): HTMLElement => {
	const children: HTMLElement[] = [];

	const format = Format.TCG;
	const primaryDetails = createDiv(
		["card-tooltip__details"],
		[
			createImg([], resourceService.getTypeImageUrl(card), {
				hidden: false,
				alt: `Type: ${card.type.name}`,
			}),
			createSpan(["card-tooltip__name"], card.name),
			createImg([], resourceService.getBanStateImageUrl(card, format), {
				hidden: false,
				alt: `Ban State: ${card.banlist[format].name}`,
			}),
		]
	);
	children.push(primaryDetails);

	if (card.type.category === CardTypeCategory.MONSTER) {
		children.push(createMonsterStats(card));
	}

	if (card.type.category !== CardTypeCategory.SKILL) {
		children.push(createSubType(card));
	}

	if (card.type.category === CardTypeCategory.MONSTER) {
		if (card.level != null) {
			const level = createDiv(
				["card-tooltip__level"],
				[
					createImg([], resourceService.getLevelImageUrl(), {
						hidden: true,
						alt: "level",
					}),
					createSpan([], `Level/Rank: ${card.level}`),
				]
			);
			children.push(level);
		} else if (card.linkMarkers != null) {
			const linkMarkers = createDiv(
				["card-tooltip__link-markers"],
				[
					createImg([], resourceService.getLinkMarkerImageUrl(), {
						hidden: true,
						alt: "Link Markers",
					}),
					createSpan(
						[],
						`Link Markers: ${card.linkMarkers.join(", ")}`
					),
				]
			);
			children.push(linkMarkers);
		}
	}

	children.push(createDescription(card));

	children.push(createPrice(card));

	return createDiv(["card-tooltip__details__col"], children);
};

const createCardImageCol = (card: Card): HTMLElement => {
	const cardImage = createImg(
		["card-tooltip__image"],
		card.image?.url ?? "#",
		{ hidden: false, alt: "Card Artwork" }
	);
	return createDiv(["card-tooltip__image__col"], [cardImage]);
};

export const createTooltipElement = (card: Card): HTMLElement =>
	createDiv(
		["card-tooltip"],
		[
			createDiv(
				["card-tooltip__content"],
				[createCardDetailsCol(card), createCardImageCol(card)]
			),
		]
	);

export const createErrorTooltip = (message: string): HTMLElement =>
	createDiv(
		["card-tooltip__content", "card-tooltip__content--error"],
		[
			createDiv(
				["card-tooltip__error"],
				[createSpan(["fas", "fa-times"], ""), createSpan([], message)]
			),
		]
	);
