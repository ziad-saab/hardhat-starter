# Hardhat Starter
This is my opinionated hardhat starter for Encode Club's Solidity bootcamp

## Structure
The project uses Yarn workspaces:

- **`blockchain`**: This is a Hardhat TypeScript project.
- **`contract-types`**: This package holds the types exported by `typechain` when running `yarn compile` from the `blockchain` package
- **`webapp`**: This package contains a React app created with vite.js

## `blockchain`
This is a Hardhat project coded in TypeScript.

### Hardhat
Hardhat is a development environment for Ethereum. It allows you to do many things:

* Hardhat lets you run a local blockchain for quick, offline development. ⚠️ One thing to be mindful of is that a local blockchain settles much faster than a real-life one: transactions get confirmed almost instantly. Moving to a live, online blockchain will result in much slower interactions, because a consensus has to be achieved about the validity of all transactions submitted to the network. Keep this in mind when developing locally, as it can negatively affect the user experience 💡
* Hardhat, through plugins, can compile Solidity smart contracts and even generate TypeScript types for working with the contracts from the front-end.
* Hardhat has features that allow you to test your smart contract code by writing automated tests using TypeScript or JavaScript.
* Hardhat has deployment plugins that allow you to coordinate complex deployments of inter-dependent smart contracts. The deployment logic can be completely custom, and is also written in TypeScript or JavaScript. Data for the deployed contracts such as the chains where it's deployed, and the public addresses of the contracts, can be automatically exported to a JSON file to be consumed by your web app. This can save you from having to hardcode smart contract addresses in your frontend code.

Head over to the [Hardhat documentation](https://hardhat.org/docs) to learn more.

### TypeScript
TypeScript is a superset of JavaScript. It understands all JavaScript syntax, and adds more syntax on top of JavaScript to help developers know which kinds of objects they're dealing with.

JavaScript has always been known for its permissive nature: internally it has very few types -- `number`, `string`, `function`, `object` being the main ones. It also allows you to do weird things like use the `+` addition operator on a number and a function ⁉️ At the same time JavaScript is the only programming language that web browsers and NodeJS understand, and, for compatibility reasons, this may take a long time to change.

When you write TypeScript code, it has to go through a transpiler, which will optionally do the type checking, and then spit out JavaScript code targeted to browsers or NodeJS. Many tools make this process automatic for you. For example, Hardhat, which is a NodeJS application, can take TypeScript files as input and execute them seemingly as-is: the transpilation process happens internally.

TypeScript allows you to assign types to variables, function arguments, and function return values. It has integrated tooling in all popular IDEs, which will highlight any type errors and mismatches as you code.

Head over to the [TypeScript documentation](https://www.typescriptlang.org/) to learn more.

### Important files
Here are some of the key files for the `blockchain` workspace:

* `hardhat.config.ts`: This file contains all the Hardhat configurations. Even third-party Hardhat plugins have their configurations in that same file.
* `/contracts`: This is where the Solidity code for your smart contracts goes
* `/deploy`: This directory contains deployment scripts. These scripts are run using the `hardhat-deploy` plugin. The `01`, `02`, ... prefixes help convey the order in which your deployments have to run. The scripts can also export an array of dependencies to make the execution order clearer.
* `/test`: This directory contains tests for your smart contracts.
* `package.json`: This file defines a NodeJS project. Among other things, it contains the dependencies (external JavaScript code) of the project, as well as a `scripts` section that allows for easy running of custom scripts.

## `webapp`
The `webapp` package contains a React application, setup with the vite.js system.

### `vite.js`
Vite is a tool that allows for rapid development of TypeScript or JavaScript applications. During development, it spins up a local web server that always serves the latest version of your code. When deploying a Dapp to production, Vite will bundle and compress all your code to a single file, making it easy to be consumed by a web browser. Vite automatically transpiles TypeScript to JavaScript, and is setup with great defaults so that you don't have to do too much configuration.

Head over to the [vite.js documentation](https://vitejs.dev/) to learn more.

### React
React is a popular UI framework built in TypeScript. It allows you to define interactive UIs by writing declarative code.

Browsers present user interfaces using a system called the DOM. A web page is a tree of elements, with the document at the root, and recursive levels of children. Children like buttons can be interactive, and pressing them can lead to execution of custom JavaScript code. That code can in turn manipulate the DOM without reloading the page, which gives way to realtime, interactive, responsive updates.

But manipulating the DOM at scale can be extremely cumbersome. Sometimes you can forget to remove some elements that have become irrelevant, or forget to disable a Submit button if a form has errors. React solves that by allowing you to declare your user interface as a function of the state of your application, and handles the DOM updates for you. In the example of the form with errors, your application would have an array of errors, and you can tell React to automatically enable or disable that button based on whether the array of errors is empty or not.

Head over to the [React documentation](https://reactjs.org/docs/getting-started.html) to learn more.

### Important files
Here are some of the key files for the `webapp` workspace:

* `package.json`: This file defines a NodeJS project. Among other things, it contains the dependencies (external JavaScript code) of the project, as well as a `scripts` section that allows for easy running of custom scripts.
* `index.html`: This file is served to your web browser, and is responsible for loading the JavaScript code that will bring your webapp to life. You'll notice that it barely contains any HTML, and this is on purpose. A React app manages the UI using JavaScript and the DOM to create, manipulate, and destroy elements on the page based on the components that you create.
* `/src`: Contains all the React code.
* `/src/App.tsx`: The main React component that gets rendered when your webapp loads.
* `/src/Mint.tsx`: This component contains logic that communicates with the blockchain layer, as well as an interactive UI that executes that logic on demand.