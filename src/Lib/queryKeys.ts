export const queryKeys = {
  pets: {
    all: ['pets'] as const,
    list: (ownerId?: number) => ['pets', 'list', ownerId] as const,
    detail: (id: number) => ['pets', 'detail', id] as const,
    species: ['pets', 'species'] as const,
    breeds: (speciesId?: number) => ['pets', 'breeds', speciesId] as const,
  },
  plans: {
    all: ['plans'] as const,
    list: () => ['plans', 'list'] as const,
    paymentMethods: ['plans', 'paymentMethods'] as const,
    subscriptions: (petId?: number) => ['plans', 'subscriptions', petId] as const,
  },
  locations: {
    states: ['locations', 'states'] as const,
    cities: ['locations', 'cities'] as const,
  },
  owner: {
    profile: (id?: number) => ['owner', 'profile', id] as const,
  },
};
