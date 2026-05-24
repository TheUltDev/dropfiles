# dropfiles

Monorepo for the Dropfiles app. Managed with [Bun](https://bun.sh/) workspaces and [Turbo](https://turbo.build/).

## Prerequisites

- [Bun](https://bun.sh/docs/installation) `>= 1.3`
- Node.js LTS (`>= 20`) — still required by some Expo native tooling.

## Setup

```sh
bun install
```

## Common scripts

```sh
bun run dev        # turbo dev across workspaces
bun run lint
bun run typecheck
bun run build
```

## App workspace (`app/`)

```sh
bun --cwd app expo start
bun --cwd app expo run:android
bun --cwd app expo run:ios
bun --cwd app expo start --web
```

## Notes

- `bunfig.toml` pins the `hoisted` linker so Windows React Native / Expo native builds don't hit `MAX_PATH` with the default isolated layout.
- Shared dependency versions live in the `workspaces.catalog` block of the root `package.json` and are consumed via `"<pkg>": "catalog:"`.
- Postinstall scripts only run for packages listed in `trustedDependencies`. Inspect blocked scripts with `bun pm untrusted`.
