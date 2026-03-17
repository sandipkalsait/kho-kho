import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import { useAppSettings } from '@/context/AppSettingsContext';

export default function OCRResultScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { colors, t } = useAppSettings();

  const [loading, setLoading] = useState(true);
  const [extractedText, setExtractedText] = useState('');
  const [processingTime, setProcessingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUri) {
      setLoading(false);
      setError("No image provided.");
      return;
    }

    const uploadAndProcessImage = async () => {
      try {
        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : `image/jpeg`;

        // React Native's fetch network layer often stringifies file objects on Android/iOS
        // The most robust way to send images to Django in Expo is using base64.
        // We will fetch it, read it to base64, and send it in a JSON payload.
        
        // Adjust API URL depending on the platform/emulator
        let API_URL = 'http://127.0.0.1:8000/api/ocr/';
        if (Platform.OS === 'android') {
          API_URL = 'http://10.0.2.2:8000/api/ocr/';
        }

        let base64Image = '';
        try {
          base64Image = await FileSystem.readAsStringAsync(imageUri, {
            encoding: 'base64' as any,
          });
        } catch (fsErr) {
          console.error("FileSystem read error: ", fsErr);
          throw new Error("Could not read image file locally.");
        }

        const response = await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({
            image_base64: base64Image,
            filename: filename,
            type: type,
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const jsonResponse = await response.json();

        if (!response.ok) {
          throw new Error(jsonResponse.error || jsonResponse.detail || 'Failed to process image');
        }

        setExtractedText(jsonResponse.text);
        setProcessingTime(jsonResponse.processing_time_ms);
      } catch (err: any) {
        setError(err.message || "Something went wrong communicating with the server.");
      } finally {
        setLoading(false);
      }
    };

    uploadAndProcessImage();
  }, [imageUri]);

  const handleProceed = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Continue to edit match, passing the raw OCR text as context if needed
    router.push({
      pathname: '/edit-match',
      params: {
        ocrData: JSON.stringify({ rawText: extractedText }),
        imageUri: imageUri || '',
      },
    });
  };

  return (
    <LinearGradient
      colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.text }]}>{t.ocrResults || 'OCR Results'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Processing image with Tesseract OCR...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error || 'red'} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <Pressable style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={{ color: colors.white, fontWeight: 'bold' }}>Go Back</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.overallCard, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
            <View style={styles.overallHeader}>
              <Feather name="check-circle" size={20} color={colors.primary} />
              <Text style={[styles.overallTitle, { color: colors.text }]}>Extraction Complete</Text>
            </View>
            <View style={styles.overallStats}>
              <View style={styles.overallStat}>
                <Text style={[styles.overallStatValue, { color: colors.text }]}>{processingTime}ms</Text>
                <Text style={[styles.overallStatLabel, { color: colors.textSecondary }]}>Processing Time</Text>
              </View>
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
            <Text style={[styles.sectionCardTitle, { color: colors.text }]}>Extracted Text</Text>
            <View style={[styles.textContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.rawText, { color: colors.text }]}>
                {extractedText || "No text could be found in the image."}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {!loading && !error && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16), backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <Pressable
            style={({ pressed }) => [styles.editButton, pressed && { opacity: 0.9 }]}
            onPress={handleProceed}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.editGradient}
            >
              <Feather name="arrow-right" size={18} color={colors.white} />
              <Text style={[styles.editButtonText, { color: colors.white }]}>Proceed</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 20
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  scrollContent: { paddingHorizontal: 20 },
  overallCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  overallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  overallTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  overallStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallStat: { flex: 1, alignItems: 'center' },
  overallStatValue: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  overallStatLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  textContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 150,
  },
  rawText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  editButton: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  editGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 28,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});
