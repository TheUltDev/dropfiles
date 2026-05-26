import type {RecipientDrop} from '@/lib/supabase';
import {openBrowserAsync} from 'expo-web-browser';
import {useLocalSearchParams} from 'expo-router';
import {useEffect, useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {Title, Body, Muted, Small} from '@/components/base/text';
import {Button, Input, Label, TextField} from '@workspace/ui';
import {createSignedDownload, getDropForRecipient} from '@/lib/db/remote';
import {formatBytes} from '@/lib/pickers';

export default function RecipientDropScreen() {
  const {id} = useLocalSearchParams<{id: string}>();
  const [drop, setDrop] = useState<RecipientDrop | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const loadDrop = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getDropForRecipient(id, {password, email});
      setDrop(data);
    } catch (err) {
      setDrop(null);
      setError(err instanceof Error ? err.message : 'Unable to open drop');
    } finally {
      setLoading(false);
    }
  }
  
  const downloadFile = async (fileId: string) => {
    try {
      const url = await createSignedDownload(fileId, {password, email});
      await openBrowserAsync(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  }
  
  useEffect(() => {
    if (!id) return;
    void loadDrop();
  }, [id]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="max-w-[800px] gap-6 px-6 pt-safe pb-safe-offset-8 self-center w-full">
        <View className="gap-2">
          <Title>Download drop</Title>
          <Muted>Enter credentials if required, then download files.</Muted>
        </View>
        {Platform.OS === 'web' ? (
          <>
            <TextField className="w-full" value={password} onChange={setPassword}>
              <Label>Password</Label>
              <Input placeholder="If required" type="password" />
            </TextField>
            <TextField className="w-full" value={email} onChange={setEmail}>
              <Label>Email</Label>
              <Input placeholder="If required" autoCapitalize="none" />
            </TextField>
          </>
        ) : (
          <>
            <TextField>
              <Label>Password</Label>
              <Input
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="If required"
              />
            </TextField>
            <TextField>
              <Label>Email</Label>
              <Input
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholder="If required"
              />
            </TextField>
          </>
        )}
        <Button onPress={loadDrop} isDisabled={loading}>
          {loading ? 'Checking…' : 'Unlock drop'}
        </Button>
        {error ? <Muted className="text-danger">{error}</Muted> : null}
        {drop?.files?.length ? (
          <View className="gap-3">
            {drop.files.map((file) => (
              <View
                key={file.id}
                className="flex-row items-center justify-between rounded-2xl bg-surface-secondary px-4 py-3">
                <View className="flex-1 pr-3">
                  <Small className="font-semibold">{file.name}</Small>
                  <Muted>
                    {formatBytes(file.size)} · {file.mime}
                  </Muted>
                  {file.hash ? <Muted>Hash: {file.hash.slice(0, 12)}…</Muted> : null}
                </View>
                <Button size="sm" onPress={() => downloadFile(file.id)}>
                  Download
                </Button>
              </View>
            ))}
          </View>
        ) : drop ? (
          <Body>No completed files yet.</Body>
        ) : null}
      </ScrollView>
    </View>
  );
}
