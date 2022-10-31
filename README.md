# Hardhat Starter
This is my opinionated hardhat starter for Encode Club's Solidity bootcamp

## Structure
The project uses Yarn workspaces:

- **`blockchain`**: This is a Hardhat TypeScript project.
- **`contract-types`**: This package holds the types exported by `typechain` when running `yarn compile` from the `blockchain` package
- **`webapp`**: This package contains a React app created with vite.js

## TODO
- [ ] Connect dApp
- [ ] Add `hardhat-deploy` extension to improve DX