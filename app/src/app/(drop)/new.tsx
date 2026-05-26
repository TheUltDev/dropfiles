import type {Href} from 'expo-router';
import type {PickedFile} from '@/lib/pickers';
import type {AccessConfig} from '@/lib/access';

import {useMemo, useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {useRouter} from 'expo-router';

import {loadSettings, settingsToAccessDefaults} from '@/lib/settings';
import {DEFAULT_ACCESS_CONFIG} from '@/lib/access';
import {uploadManager} from '@/lib/storage/manager';
import {formatBytes} from '@/lib/pickers';
import {Button} from '@workspace/ui';

import {Title, Body, Muted, Small} from '@/components/base/text';
import {DropWizardStepper} from '@/components/upload/DropWizardStepper';
import {AccessConfigForm} from '@/components/upload/AccessConfigForm';
import {FilePickerSheet} from '@/components/upload/FilePickerSheet';

const STEPS = ['Access', 'Files', 'Review'];

export default function NewDropScreen() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [access, setAccess] = useState<AccessConfig>(DEFAULT_ACCESS_CONFIG);
  const [submitting, setSubmitting] = useState(false);
  const totalBytes = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );
  
  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const id = await uploadManager.createDropWithFiles(access, files);
      router.replace(`/drop/${id}` as Href);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create drop');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    void loadSettings().then((settings) => {
      setAccess((current) => ({
        ...current,
        ...settingsToAccessDefaults(settings),
      }));
    });
  }, []);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="max-w-[800px] gap-6 px-6 pt-safe pb-safe-offset-8 self-center w-full">
        <View className="gap-2">
          <Title>New drop</Title>
          <Muted>Configure access, pick files, and upload with resume support.</Muted>
        </View>
        <DropWizardStepper
          steps={STEPS}
          currentStep={step}
        />
        {step === 0 ? (
          <AccessConfigForm
            value={access}
            onChange={setAccess}
          />
        ) : null}
        {step === 1 ? (
          <FilePickerSheet
            files={files}
            maxFiles={access.maxFiles}
            onChange={setFiles}
          />
        ) : null}
        {step === 2 ? (
          <View className="gap-4 rounded-3xl bg-surface-secondary p-5">
            <Body className="font-semibold">
              Review
            </Body>
            <Muted>
              {files.length} file(s), {formatBytes(totalBytes)} total
            </Muted>
            {files.map((file) => (
              <Small key={file.id}>
                {file.name} · {formatBytes(file.size)}
              </Small>
            ))}
          </View>
        ) : null}
        {error ? <Muted className="text-danger">{error}</Muted> : null}
        <View className="flex-row gap-3">
          {step > 0 ? (
            <Button
              variant="secondary"
              className="flex-1"
              onPress={() => setStep((s) => s - 1)}>
              Back
            </Button>
          ) : null}
          {step < STEPS.length - 1 ? (
            <Button
              className="flex-1"
              onPress={() => setStep((s) => s + 1)}
              isDisabled={step === 1 && files.length === 0}>
              Next
            </Button>
          ) : (
            <Button
              className="flex-1"
              onPress={handleCreate}
              isDisabled={submitting}>
              {submitting ? 'Creating…' : 'Start upload'}
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
