import { instance, mock, when } from "ts-mockito";
import { createCard } from "../../helper/dataFactories";
import type { CardDatabase } from "@/core/lib";
import { DeckFileService, DeckPart, FindCardBy } from "@/core/lib";
import { MockCardDatabase } from "../../helper/MockCardDatabase";
import { beforeEach, describe, expect, it } from "vitest";
import { createServices } from "@/__tests__/helper/serviceFactories";

describe("DeckFileService", () => {
	let deckFileService: DeckFileService;

	let cardDatabaseMock: CardDatabase;

	beforeEach(() => {
		cardDatabaseMock = mock(MockCardDatabase);
		const cardDatabase = instance(cardDatabaseMock);
		const { deckService } = createServices(cardDatabase);

		deckFileService = new DeckFileService(cardDatabase, deckService);
	});

	describe("fromFile", () => {
		it("processes filename", () => {
			expect(
				deckFileService.fromFile({
					fileContent: "",
					fileName: "foo.ydk",
				}).deck.name
			).toBe("foo");
		});

		it("puts missing", () => {
			const fileContent = `
#main
123`;
			const result = deckFileService.fromFile({
				fileContent,
				fileName: "foo.ydk",
			});
			expect(result.missing.length).toBe(1);
			expect(result.missing).toContain("123");
		});

		it("puts card", () => {
			const fileContent = `
#main
123`;
			const card = createCard({ passcode: "123" });
			when(
				cardDatabaseMock.hasCard("123", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("123", FindCardBy.PASSCODE)
			).thenReturn(card);

			const result = deckFileService.fromFile({
				fileContent,
				fileName: "foo.ydk",
			});
			expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
			expect(result.deck.parts[DeckPart.MAIN]).toContain(card);
			expect(result.missing.length).toBe(0);
		});

		it("puts multiple", () => {
			const fileContent = `
#main
123
123
123`;
			const card = createCard({ passcode: "123" });
			when(
				cardDatabaseMock.hasCard("123", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("123", FindCardBy.PASSCODE)
			).thenReturn(card);

			const result = deckFileService.fromFile({
				fileContent,
				fileName: "foo.ydk",
			});
			expect(result.deck.parts[DeckPart.MAIN].length).toBe(3);
			expect(result.deck.parts[DeckPart.MAIN]).toEqual([
				card,
				card,
				card,
			]);
			expect(result.missing.length).toBe(0);
		});

		it("puts per deckpart", () => {
			const fileContent = `
#main
123

#extra
456

!side
789`;

			const card1 = createCard({ passcode: "123" });
			when(
				cardDatabaseMock.hasCard("123", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("123", FindCardBy.PASSCODE)
			).thenReturn(card1);

			const card2 = createCard({ passcode: "456" });
			when(
				cardDatabaseMock.hasCard("456", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("456", FindCardBy.PASSCODE)
			).thenReturn(card2);

			const card3 = createCard({ passcode: "789" });
			when(
				cardDatabaseMock.hasCard("789", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("789", FindCardBy.PASSCODE)
			).thenReturn(card3);

			const result = deckFileService.fromFile({
				fileContent,
				fileName: "foo.ydk",
			});
			expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
			expect(result.deck.parts[DeckPart.MAIN]).toContain(card1);
			expect(result.deck.parts[DeckPart.EXTRA]!.length).toBe(1);
			expect(result.deck.parts[DeckPart.EXTRA]).toContain(card2);
			expect(result.deck.parts[DeckPart.SIDE]!.length).toBe(1);
			expect(result.deck.parts[DeckPart.SIDE]).toContain(card3);
			expect(result.missing.length).toBe(0);
		});

		it("ignores optional creator note", () => {
			const fileContent = `
#created by ...
#main
123`;
			const card = createCard({ passcode: "123" });
			when(
				cardDatabaseMock.hasCard("123", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("123", FindCardBy.PASSCODE)
			).thenReturn(card);

			const result = deckFileService.fromFile({
				fileContent,
				fileName: "foo.ydk",
			});
			expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
			expect(result.deck.parts[DeckPart.MAIN]).toContain(card);
		});

		it("supports zero-padded", () => {
			const fileContent = `
#created by ...
#main
0000123`;
			const card = createCard({ passcode: "123" });
			when(
				cardDatabaseMock.hasCard("123", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("123", FindCardBy.PASSCODE)
			).thenReturn(card);

			const result = deckFileService.fromFile({
				fileContent,
				fileName: "foo.ydk",
			});
			expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
			expect(result.deck.parts[DeckPart.MAIN]).toContain(card);
		});
	});

	describe("toFile", () => {
		it("processes name", () => {
			expect(
				deckFileService.toFile({
					name: "foo",
					parts: {
						[DeckPart.MAIN]: [],
						[DeckPart.EXTRA]: [],
						[DeckPart.SIDE]: [],
					},
				}).fileName
			).toBe("foo.ydk");
		});

		it("puts cards", () => {
			expect(
				deckFileService.toFile({
					name: "foo",
					parts: {
						[DeckPart.MAIN]: [createCard({ passcode: "123" })],
						[DeckPart.EXTRA]: [],
						[DeckPart.SIDE]: [],
					},
				}).fileContent
			).toContain(
				`#main
123`
			);
		});

		it("puts per deckpart", () => {
			expect(
				deckFileService.toFile({
					name: "foo",
					parts: {
						[DeckPart.MAIN]: [createCard({ passcode: "123" })],
						[DeckPart.EXTRA]: [createCard({ passcode: "456" })],
						[DeckPart.SIDE]: [createCard({ passcode: "789" })],
					},
				}).fileContent
			).toBe(
				`#main
123

#extra
456

!side
789
`
			);
		});
	});
});
