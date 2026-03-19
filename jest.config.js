/** Root Jest entry: each project runs through next/jest so TS/SWC transforms apply. */
module.exports = {
  projects: ["<rootDir>/jest.client.config.js", "<rootDir>/jest.api.config.js"],
};
