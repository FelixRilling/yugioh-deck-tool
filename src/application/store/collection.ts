import type { CardCountFunction } from "@/core/lib";
import { defineStore } from "pinia";

interface CollectionState {
	cardCountFunction: CardCountFunction | null;
}

export const useCollectionStore = defineStore("collection", {
	state(): CollectionState {
		return {
			cardCountFunction: null,
		};
	},
});
