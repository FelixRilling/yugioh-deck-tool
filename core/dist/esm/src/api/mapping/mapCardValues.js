import { CardTypeGroup } from "../../core/model/CardTypeGroup";
import { DefaultDeckPart } from "../../core/model/DefaultDeckPart";
const mapGroup = (type) => {
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
const mapDeckPart = (type) => new Set(type.area.map(area => {
    if (area === "SIDE") {
        return DefaultDeckPart.SIDE;
    }
    if (area === "EXTRA") {
        return DefaultDeckPart.EXTRA;
    }
    return DefaultDeckPart.MAIN;
}));
const mapCardValues = (data) => {
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
export { mapCardValues };