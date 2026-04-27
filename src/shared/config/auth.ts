export default {
  jwt: {
    secret: process.env.JWT_SECRET || "tenda-solar-2026",
    expiresIn: "1h",
  },
};
