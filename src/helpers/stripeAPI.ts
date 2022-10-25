import Crypto from "crypto";

const fakeStripeAPI = async (amount: number, currency: string) => {
  const client_secret = Crypto.randomBytes(24).toString("base64").slice(0, 24);

  return { client_secret, amount };
};

export default fakeStripeAPI
