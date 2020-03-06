import { CardValues } from "../../core/model/CardValues";
import { CardTypeGroup } from "../../core/model/CardTypeGroup";
import { DeckPart } from "../../core/model/DeckPart";
import { DefaultDeckPart } from "../../core/model/DefaultDeckPart";

// https://jvilk.com/MakeTypes/
interface RawCardValues {
    types: RawCardType[];
    MONSTER: RawMonsterGroupValues;
    SPELL: GroupValues;
    TRAP: GroupValues;
    SKILL: GroupValues;
}

interface RawCardType {
    name: string;
    group: "MONSTER" | "SPELL" | "TRAP" | "SKILL";
    sortGroup: number;
    area: Array<"MAIN" | "EXTRA" | "SIDE">;
}

interface RawMonsterGroupValues {
    type: string[];
    race: string[];
    attributes: string[];
    level: number[];
    linkmarkers: string[];
}

interface GroupValues {
    type: string[];
    race: string[];
}

const mapGroup = (type: RawCardType): CardTypeGroup => {
    if (type.group === "SKILL") {
        return CardTypeGroup.SKILL;
    }
    if (type.group === "SPELL") {
        return CardTypeGroup.SPELL;
    }
    if (type.group === "TRAP") {
        return CardTypeGroup.TRAP;
    }
    return CardTypeGroup.MONSTER;
};

const mapDeckPart = (type: RawCardType): Set<DeckPart> =>
    new Set(
        type.area.map(area => {
            if (area === "SIDE") {
                return DefaultDeckPart.SIDE;
            }
            if (area === "EXTRA") {
                return DefaultDeckPart.EXTRA;
            }
            return DefaultDeckPart.MAIN;
        })
    );

const mapCardValues = (data: RawCardValues): CardValues => {
    return {
        types: data.types.map(type => {
            return {
                name: type.name,
                group: mapGroup(type),
                sortGroup: type.sortGroup,
                deckPart: mapDeckPart(type)
            };
        }),
        values: {
            [CardTypeGroup.MONSTER]: {
                races: data.MONSTER.race,
                attributes: data.MONSTER.attributes,
                levels: data.MONSTER.level,
                linkMarkers: data.MONSTER.linkmarkers
            },
            [CardTypeGroup.SPELL]: {
                races: data.SPELL.race
            },
            [CardTypeGroup.TRAP]: {
                races: data.TRAP.race
            },
            [CardTypeGroup.SKILL]: {
                races: data.SKILL.race
            }
        }
    };
};

export { mapCardValues, RawCardValues };
