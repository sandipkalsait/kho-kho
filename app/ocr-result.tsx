import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAppSettings } from '@/context/AppSettingsContext';
import { simulateOCR } from '@/lib/match-storage';
import { ThemeColors } from '@/constants/colors';

interface EditableData {
  teamAName: string;
  teamBName: string;
  date: string;
  venue: string;
  teamAPlayers: { name: string; score: string }[];
  teamBPlayers: { name: string; score: string }[];
}

function EditableFieldCompact({
  label,
  value,
  onChangeText,
  colors,
  width,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  colors: ThemeColors;
  width?: number | string;
}) {
  return (
    <View style={[styles.editFieldCompact, { width }]}>
      <Text style={[styles.editLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[styles.editInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textTertiary}
      />
    </View>
  );
}

function TeamPlayersTable({
  teamName,
  players,
  onTeamNameChange,
  onPlayerChange,
  colors,
  t,
}: {
  teamName: string;
  players: { name: string; score: string }[];
  onTeamNameChange: (name: string) => void;
  onPlayerChange: (index: number, field: 'name' | 'score', value: string) => void;
  colors: ThemeColors;
  t: any;
}) {
  const totalScore = players.reduce((sum, p) => sum + (parseInt(p.score) || 0), 0);

  return (
    <View style={[styles.teamSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.teamTitleRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.teamLabel, { color: colors.textSecondary }]}>Team</Text>
        <TextInput
          style={[
            styles.teamNameInput,
            { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text },
          ]}
          value={teamName}
          onChangeText={onTeamNameChange}
          placeholderTextColor={colors.textTertiary}
        />
        <View style={[styles.totalScorePill, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.totalScoreText, { color: colors.primary }]}>
            {totalScore}
          </Text>
        </View>
      </View>

      <View style={[styles.playerTableHeader, { backgroundColor: colors.primaryLight, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerCell, { color: colors.primary, width: 30 }]}>
          #
        </Text>
        <Text style={[styles.headerCell, { color: colors.primary, flex: 1 }]}>
          Player Name
        </Text>
        <Text style={[styles.headerCell, { color: colors.primary, width: 60, textAlign: 'center' }]}>
          Pts
        </Text>
      </View>

      {players.map((player, idx) => (
        <View key={idx} style={[styles.playerRow, { borderBottomColor: colors.border + '40' }]}>
          <Text style={[styles.playerNum, { color: colors.textTertiary, width: 30 }]}>
            {idx + 1}
          </Text>
          <TextInput
            style={[
              styles.playerNameCell,
              { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 },
            ]}
            value={player.name}
            onChangeText={(text) => onPlayerChange(idx, 'name', text)}
            placeholderTextColor={colors.textTertiary}
          />
          <TextInput
            style={[
              styles.playerScoreCell,
              { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, width: 60 },
            ]}
            value={player.score}
            onChangeText={(text) => onPlayerChange(idx, 'score', text)}
            keyboardType="numeric"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
      ))}
    </View>
  );
}

export default function OCRResultScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { colors, t } = useAppSettings();

  const initialOcrData = useMemo(() => {
    // Start with empty scoresheet
    return {
      teamAName: '',
      teamBName: '',
      date: '',
      venue: '',
      teamAPlayers: Array.from({ length: 9 }, () => ({ name: '', score: '' })),
      teamBPlayers: Array.from({ length: 9 }, () => ({ name: '', score: '' })),
    };
  }, []);

  const [data, setData] = useState<EditableData>(initialOcrData);

  const handleTeamANameChange = (name: string) => {
    setData(prev => ({ ...prev, teamAName: name }));
  };

  const handleTeamBNameChange = (name: string) => {
    setData(prev => ({ ...prev, teamBName: name }));
  };

  const handleDateChange = (date: string) => {
    setData(prev => ({ ...prev, date }));
  };

  const handleVenueChange = (venue: string) => {
    setData(prev => ({ ...prev, venue }));
  };

  const handleTeamAPlayerChange = (index: number, field: 'name' | 'score', value: string) => {
    setData(prev => {
      const updated = [...prev.teamAPlayers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, teamAPlayers: updated };
    });
  };

  const handleTeamBPlayerChange = (index: number, field: 'name' | 'score', value: string) => {
    setData(prev => {
      const updated = [...prev.teamBPlayers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, teamBPlayers: updated };
    });
  };

  const handleEdit = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const ocrData = {
      teamAName: data.teamAName,
      teamANameConfidence: 0.85,
      teamBName: data.teamBName,
      teamBNameConfidence: 0.85,
      teamAPlayers: data.teamAPlayers.map(p => ({
        name: p.name,
        score: parseInt(p.score) || 0,
        confidence: 0.8,
      })),
      teamBPlayers: data.teamBPlayers.map(p => ({
        name: p.name,
        score: parseInt(p.score) || 0,
        confidence: 0.8,
      })),
      date: data.date,
      dateConfidence: 0.95,
      venue: data.venue,
      venueConfidence: 0.80,
      autoFilledFields: [] as string[],
    };

    router.push({
      pathname: '/edit-match',
      params: {
        ocrData: JSON.stringify(ocrData),
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
        <Text style={[styles.topTitle, { color: colors.text }]}>{t.ocrResults}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Kho-Kho Scoresheet.xlsx</Text>
            <View style={styles.headerGrid}>
              <EditableFieldCompact
                label={t.date}
                value={data.date}
                onChangeText={handleDateChange}
                colors={colors}
                width="48%"
              />
              <EditableFieldCompact
                label={t.venue}
                value={data.venue}
                onChangeText={handleVenueChange}
                colors={colors}
                width="48%"
              />
            </View>
          </View>

          <TeamPlayersTable
            teamName={data.teamAName}
            players={data.teamAPlayers}
            onTeamNameChange={handleTeamANameChange}
            onPlayerChange={handleTeamAPlayerChange}
            colors={colors}
            t={t}
          />

          <TeamPlayersTable
            teamName={data.teamBName}
            players={data.teamBPlayers}
            onTeamNameChange={handleTeamBNameChange}
            onPlayerChange={handleTeamBPlayerChange}
            colors={colors}
            t={t}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16), backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [styles.confirmButton, pressed && { opacity: 0.9 }]}
          onPress={handleEdit}
        >
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.confirmGradient}
          >
            <Feather name="check" size={18} color={colors.white} />
            <Text style={[styles.confirmButtonText, { color: colors.white }]}>{t.reviewAndEdit}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  overallDivider: {
    width: 1,
    height: 32,
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
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  totalScoreLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_500Medium',
  },
  totalScoreValue: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  fieldLeft: { flex: 1 },
  fieldLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 2,
  },
  fieldRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
  },
  autoFillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 2,
  },
  autoFillText: {
    fontSize: 9,
    fontFamily: 'Nunito_600SemiBold',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  playerHeaderText: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
    textTransform: 'uppercase',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  playerIndex: {
    width: 24,
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  playerScore: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    marginRight: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  warningCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  warningTitle: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginTop: 2,
    lineHeight: 18,
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
  confirmButton: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 28,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  teamSection: {
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
  },
  teamTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    marginBottom: 8,
  },
  teamLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 8,
  },
  teamNameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  totalScorePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  totalScoreText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  playerTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 2,
    marginBottom: 4,
  },
  headerCell: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  playerNum: {
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
  },
  playerNameCell: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  playerScoreCell: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
  },
  headerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editFieldCompact: {
    marginBottom: 8,
  },
  editLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
});
