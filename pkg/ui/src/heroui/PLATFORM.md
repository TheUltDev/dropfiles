# HeroUI cross-platform notes

## Build (`@workspace/ui`)

- **Dev (Metro)**: `package.json` `development` export resolves to `src/` for HMR. Metro must include the `development` condition (see `app/metro.config.js`).
- **Production**: `bun run build --filter=@workspace/ui` (Rolldown) emits `dist/native` and `dist/web` with platform-specific resolution (`.web.tsx` vs `.tsx`). Run this before `expo export`.
- **Types**: `dist/types` from `tsc -p tsconfig.build.json`.

## App setup

- **Native**: Wrap the app in `GestureHandlerRootView`, then `UiProvider` (`HeroUINativeProvider`).
- **Theme**: Import `@workspace/ui/theme.css` from `app/src/global.css` (after `heroui-native/styles`). Do not redefine `--segment` / `--background` as the same color.
- **Web**: Import `@heroui/styles/precompiled` and `@heroui-pro/react/css` (see `app/src/lib/layout/styles.web.ts`).
- **Uniwind**: Scan `heroui-native` and `heroui-native-pro` in `global.css` `@source` paths.

## API aliases

| `@workspace/ui` | Native (`heroui-native`) | Web (`@heroui/react`) |
|---------------|--------------------------|------------------------|
| `Dialog` | `Dialog` | `Modal` |
| `Menu` | `Menu` | `Dropdown` |
| `SubMenu` | `SubMenu` | `Dropdown.SubmenuTrigger` |
| `LinkButton` | `LinkButton` | `Link` (+ `onPress` / `href`) |
| `Typography` | `Typography` | `Typography` |
| `ListBox` | use `Select` / `Menu` | `ListBox` |
| `TagGroup.Item` | `TagGroup.Item` | `Tag` |
| `RadioGroup.Item` | `RadioGroup.Item` | `Radio` |
| `Card.Body` | `Card.Body` | `Card.Content` |
| `Accordion.Content` | `Accordion.Content` | `Accordion.Panel` + `Body` |
| `Tabs.Trigger` / `Content` | `Trigger` / `Content` | `Tab` / `Panel` (`value` ↔ `id`) |
| `SearchField.Group` | same | include `SearchField.SearchIcon` on web |

## Stack polyfills

- **Autocomplete**: Web uses `@heroui/react` Autocomplete; native uses Select + Chip until upstream ships Autocomplete.
- **DropZone**: Web re-exports `@heroui-pro/react/drop-zone`; native uses a Pressable compound polyfill.

## Native-only hooks

`useDialog`, `useMenu`, `useSubMenu`, `useControlField`, and `useToast` throw on web — use component controlled state instead.
