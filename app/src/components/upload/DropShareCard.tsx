import {View} from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import {useThemeColor, Button} from '@workspace/ui';
import {Title, Body, Muted, Small} from '@/components/base/text';
import type {AccessConfig} from '@/lib/access';
import {summarizeAccess} from '@/lib/access';

type Props = {
  dropId: string;
  access: AccessConfig;
  expiresAt?: string | null;
};

export function DropShareCard({dropId, access, expiresAt}: Props) {
  const url = Linking.createURL(`/d/${dropId}`);
  const [foreground, accent, surface] = useThemeColor([
    'foreground',
    'accent',
    'surface',
  ]);

  async function copyLink() {
    await Clipboard.setStringAsync(url);
  }

  return (
    <View className="gap-4 rounded-3xl bg-surface-secondary p-5">
      <Title className="text-2xl">Share drop</Title>
      <Muted>{summarizeAccess(access)}</Muted>
      {expiresAt ? <Muted>Expires {new Date(expiresAt).toLocaleString()}</Muted> : null}

      <View className="items-center gap-3">
        <View
          className="rounded-3xl p-4"
          style={{backgroundColor: surface}}>
          <QRCodeStyled
            data={url}
            size={200}
            pieceBorderRadius={0}
            pieceCornerType="rounded"
            pieceLiquidRadius={3}
            color={foreground}
            outerEyesOptions={{
              borderRadius: 12,
              color: accent,
            }}
            innerEyesOptions={{
              borderRadius: 4,
              color: accent,
            }}
          />
        </View>
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
