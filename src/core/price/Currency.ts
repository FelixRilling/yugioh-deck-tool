export interface Currency {
	/**
	 * See {@link Intl.NumberFormatOptions#currency}.
	 */
	readonly id: string;
}

export const DefaultCurrency: Record<string, Currency> = {
	USD: {
		id: "USD",
	},
	EUR: {
		id: "EUR",
	},
} as const;
