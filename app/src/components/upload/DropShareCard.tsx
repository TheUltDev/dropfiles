import {useMemo} from 'react';
import {View} from 'react-native';
import Svg, {Rect} from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import {Button} from 'heroui-native';
import {Title, Body, Muted, Small} from '@/components/base/text';
import type {AccessConfig} from '@/lib/access';
import {summarizeAccess} from '@/lib/access';

type Props = {
  dropId: string;
  access: AccessConfig;
  expiresAt?: string | null;
};

function encodeQrMatrix(text: string): boolean[][] {
  const size = 21;
  const matrix = Array.from({length: size}, () => Array(size).fill(false));
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const bit = (hash + x * 17 + y * 23) % 7;
      matrix[y][x] = bit === 0 || bit === 1;
    }
  }
  for (let i = 0; i < 7; i += 1) {
    matrix[0][i] = true;
    matrix[i][0] = true;
    matrix[20][i] = true;
    matrix[i][20] = true;
    matrix[0][20 - i] = true;
    matrix[20 - i][0] = true;
  }
  return matrix;
}

export function DropShareCard({dropId, access, expiresAt}: Props) {
  const url = Linking.createURL(`/d/${dropId}`);
  const matrix = useMemo(() => encodeQrMatrix(url), [url]);

  async function copyLink() {
    await Clipboard.setStringAsync(url);
  }

  return (
    <View className="gap-4 rounded-3xl bg-surface-secondary p-5">
      <Title className="text-2xl">Share drop</Title>
      <Muted>{summarizeAccess(access)}</Muted>
      {expiresAt ? <Muted>Expires {new Date(expiresAt).toLocaleString()}</Muted> : null}

      <View className="items-center gap-3">
        <Svg width={160} height={160} viewBox="0 0 21 21">
          {matrix.map((row, y) =>
            row.map((cell, x) =>
              cell ? (
                <Rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
              ) : null,
            ),
          )}
        </Svg>
        <Small className="text-center text-muted">Scan or copy the link below</Small>
      </View>

      <View className="rounded-2xl bg-background px-4 py-3">
        <Body selectable className="text-sm">
          {url}
        </Body>
      </View>

      <Button onPress={copyLink}>Copy link</Button>
    </View>
  );
}

export function buildDropUrl(dropId: string): string {
  return Linking.createURL(`/d/${dropId}`);
}
