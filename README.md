


# Usage Notes
- Start server by running `yarn start`. This launches razzle, which in turn manages two webpack processes, one for the server, one for the client.

# Notes on usage of repo
- Use `yarn`, not `npm`

# Get razzle running locally

Build local docker image: `docker build -t nrcstat-razzle .`
Run it: `docker run -p 3000:3000 -v "$(pwd)":/app -v /app/node_modules --name nrcstat-razzle nrcstat-razzle`

That starts `yarn start` under the hood

Need to stop it by running `docker stop nrcstat-razzle` and then `docker rm nrcstat-razzle` every time 😅

# Other tips

I use loadable-components but since long have forgotten the details of how I set it up. It's useful to check out https://github.com/gregberge/loadable-components.git. There's an examples folder that contains an example on how to use with razzle. Maybe wanna check that out.

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
1. Push to `develop` (perhaps we should stick to using only `master` or `main` in the future)
2. SSH into razzle.nrcdata.no
3. `cd` into the razzle directory
4. Run `yarn build`
5. Run `forever restartall`