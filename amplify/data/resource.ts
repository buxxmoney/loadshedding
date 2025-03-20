import { type ClientSchema, a, defineData } from "@aws-amplify/backend";


const schema = a.schema({
    Listing: a
      .model({
        id: a.id().required(),
        sellerId: a.string().required(),
        sellerName: a.string().required(),
        energy: a.integer().required(),
        pricePerKwh: a.float().required(),
        totalPrice: a.float().required(),
        location: a.string().required(),
        createdAt: a.datetime().required(),
      }).authorization((allow) => [
        allow.groups(["EDITORS"]).to(["read","delete"]),
        allow.owner().to(["create", "update", "delete"]),
      ]),

      Transaction: a
      .model({
        id: a.id().required(),
        sellerId: a.string().required(),
        buyerId: a.string().required(),
        energy: a.integer().required(),
        pricePerKwh: a.float().required(),
        totalPrice: a.float().required(),
        createdAt: a.datetime().required(),
        listingId: a.string().required(),
      }).authorization((allow) => [
        allow.groups(["EDITORS"]).to(["read", "delete"]),
        allow.owner().to(["create", "read", "update"]),
      ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});