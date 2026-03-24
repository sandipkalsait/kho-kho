import React, { useEffect, useMemo } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useOcrDraft } from '@/context/OcrDraftContext';
import ScoresheetSheet from '@/components/ScoresheetSheet';
import { getDraftValidationIssues } from '@/lib/dummy-ocr';

export default function ScoresheetPreviewScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const { colors } = useAppSettings();
  const { imageUri, requestId } = useLocalSearchParams<{ imageUri?: string; requestId?: string }>();
  const {
    draft,
    ensureDummyDraft,
    updateMetaField,
    updateOfficialField,
    updateTeamField,
    updatePlayerField,
  } = useOcrDraft();

  useEffect(() => {
    ensureDummyDraft({ imageUri, requestId });
  }, [ensureDummyDraft, imageUri, requestId]);

  const issues = useMemo(() => (draft ? getDraftValidationIssues(draft) : []), [draft]);

  const handleContinue = () => {
    if (!draft) {
      Alert.alert('Missing draft', 'The dummy OCR sheet is not ready yet.');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/ocr-result');
  };

  if (!draft) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#ECE9E2' }]}>
        <Text style={styles.loadingText}>Preparing dummy correction sheet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.topBarButton}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.topBarTitle}>Correction Sheet</Text>
        <View style={styles.topBarPill}>
          <Text style={styles.topBarPillText}>Dummy Record</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Manual correction step</Text>
            <Text style={styles.infoText}>
              This page uses dummy OCR data. Yellow cells are intentionally blank so the operator can enter the missing values before confirmation.
            </Text>
            <Text style={styles.infoMeta}>
              Current pending fields: {issues.map((issue) => issue.label).slice(0, 4).join(', ')}
              {issues.length > 4 ? ` +${issues.length - 4} more` : ''}
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sheetScrollContent}>
            <ScoresheetSheet
              draft={draft}
              editable
              onMetaFieldChange={updateMetaField}
              onOfficialFieldChange={updateOfficialField}
              onTeamFieldChange={updateTeamField}
              onPlayerFieldChange={updatePlayerField}
              colors={colors}
            />
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Preview Final Confirmation</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#ECE9E2',
  },
  topBar: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  topBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  topBarPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  topBarPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D2C8',
    padding: 16,
    gap: 6,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#111111',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Nunito_500Medium',
    color: '#434343',
  },
  infoMeta: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: '#7A5F17',
  },
  sheetScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F7F3EB',
    borderTopWidth: 1,
    borderTopColor: '#D8D2C8',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#333333',
  },
});
