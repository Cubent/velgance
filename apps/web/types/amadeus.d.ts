declare module 'amadeus' {
  interface Amadeus {
    shopping: {
      flightOffersSearch: {
        get(params: any): Promise<{ data: any[] }>;
      };
    };
  }

  interface AmadeusConstructor {
    new (config: { clientId: string; clientSecret: string }): Amadeus;
  }

  const Amadeus: AmadeusConstructor;
  export = Amadeus;
}
