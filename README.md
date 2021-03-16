


# Usage Notes
- Start server by running `yarn start`. This launches razzle, which in turn manages two webpack processes, one for the server, one for the client.

# Notes on usage of repo
- Use `yarn`, not `npm`


# Get the razzle example running

Steps:

1. Download repository

```bash
git clone https://github.com/gregberge/loadable-components.git
```

2. move into example directory

```bash
cd ./loadable-components/examples/razzle
```

3. install [https://yarnpkg.com/lang/en/docs/install](yarn) if haven't already
4. install project dependencies

```bash
yarn
```

5. run locally or build and serve

```bash
yarn dev
# or
yarn build
yarn start:prod
```


# Troubleshooting techniques

I spent almost 4-5 hours scratching my head over why the new `Pictogram` widget wouldn't work. In `src/Widget/Pictogram/Pictogram.js`. Turns out that I was doing this...
```
export function Pictogram () { blabla }
```
instead of the correct this:
```
function Pictogram () { blabla }
export default Pictogram
```

I didn't use the default export. FML. 🤦‍♂️


# Deployment