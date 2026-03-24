import React from 'react';
import { DimensionValue, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemeColors } from '@/constants/colors';
import { ScoresheetDraft, ScoresheetTeamDraft, getTeamTotal } from '@/lib/dummy-ocr';

type TeamKey = 'teamA' | 'teamB';
type TeamField = 'name' | 'coach' | 'manager' | 'supportStaff';
type MetaField =
  | 'tournament'
  | 'category'
  | 'stage'
  | 'date'
  | 'time'
  | 'venue'
  | 'courtNo'
  | 'matchNo'
  | 'tossWinner'
  | 'result'
  | 'remarks';
type OfficialField = 'referee1' | 'referee2' | 'scorer' | 'timekeeper';
type PlayerField = 'name' | 'score';

interface ScoresheetSheetProps {
  draft: ScoresheetDraft;
  editable: boolean;
  colors: ThemeColors;
  onMetaFieldChange?: (field: MetaField, value: string) => void;
  onOfficialFieldChange?: (field: OfficialField, value: string) => void;
  onTeamFieldChange?: (team: TeamKey, field: TeamField, value: string) => void;
  onPlayerFieldChange?: (team: TeamKey, index: number, field: PlayerField, value: string) => void;
}

function SheetField(props: {
  label: string;
  value: string;
  editable: boolean;
  onChangeText?: (value: string) => void;
  width?: DimensionValue;
  align?: 'left' | 'center';
  multiline?: boolean;
}) {
  const { label, value, editable, onChangeText, width, align = 'left', multiline = false } = props;
  const isEmpty = !value.trim();

  return (
    <View style={[styles.fieldCell, width !== undefined && { width }]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholder=""
          style={[
            styles.fieldInput,
            align === 'center' ? styles.centerText : styles.leftText,
            multiline && styles.fieldInputMultiline,
            isEmpty && styles.emptyFieldInput,
          ]}
          textAlignVertical={multiline ? 'top' : 'center'}
          keyboardType={label === 'Pts' ? 'numeric' : 'default'}
        />
      ) : (
        <View style={[styles.fieldValue, multiline && styles.fieldValueMultiline]}>
          <Text style={[styles.fieldValueText, align === 'center' ? styles.centerText : styles.leftText, isEmpty && styles.emptyValueText]}>
            {isEmpty ? '--' : value}
          </Text>
        </View>
      )}
    </View>
  );
}

function TeamPanel(props: {
  teamKey: TeamKey;
  title: string;
  team: ScoresheetTeamDraft;
  editable: boolean;
  onTeamFieldChange?: (team: TeamKey, field: TeamField, value: string) => void;
  onPlayerFieldChange?: (team: TeamKey, index: number, field: PlayerField, value: string) => void;
}) {
  const { teamKey, title, team, editable, onTeamFieldChange, onPlayerFieldChange } = props;
  const total = String(getTeamTotal(team));

  return (
    <View style={styles.teamPanel}>
      <View style={styles.teamHeaderRow}>
        <Text style={styles.teamHeaderText}>{title}</Text>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{total}</Text>
        </View>
      </View>

      <View style={styles.inlineFieldsRow}>
        <SheetField
          label="Team Name"
          value={team.name}
          editable={editable}
          onChangeText={(value) => onTeamFieldChange?.(teamKey, 'name', value)}
          width="44%"
        />
        <SheetField
          label="Manager"
          value={team.manager}
          editable={editable}
          onChangeText={(value) => onTeamFieldChange?.(teamKey, 'manager', value)}
          width="18%"
        />
        <SheetField
          label="Coach"
          value={team.coach}
          editable={editable}
          onChangeText={(value) => onTeamFieldChange?.(teamKey, 'coach', value)}
          width="18%"
        />
        <SheetField
          label="Support"
          value={team.supportStaff}
          editable={editable}
          onChangeText={(value) => onTeamFieldChange?.(teamKey, 'supportStaff', value)}
          width="18%"
        />
      </View>

      <View style={styles.playersTable}>
        <View style={styles.playersHeaderRow}>
          <Text style={[styles.tableHeaderCell, styles.serialCell]}>No</Text>
          <Text style={[styles.tableHeaderCell, styles.playerNameCell]}>Player Name</Text>
          <Text style={[styles.tableHeaderCell, styles.scoreCell]}>Pts</Text>
        </View>
        {team.players.map((player, index) => (
          <View key={`${teamKey}-${index}`} style={styles.playersDataRow}>
            <View style={[styles.tableDataCell, styles.serialCell]}>
              <Text style={styles.tableIndexText}>{index + 1}</Text>
            </View>
            <View style={[styles.tableDataCell, styles.playerNameCell]}>
              {editable ? (
                <TextInput
                  value={player.name}
                  onChangeText={(value) => onPlayerFieldChange?.(teamKey, index, 'name', value)}
                  style={[styles.playerInput, !player.name.trim() && styles.emptyFieldInput]}
                  placeholder=""
                />
              ) : (
                <Text style={[styles.playerText, !player.name.trim() && styles.emptyValueText]}>
                  {player.name.trim() || '--'}
                </Text>
              )}
            </View>
            <View style={[styles.tableDataCell, styles.scoreCell]}>
              {editable ? (
                <TextInput
                  value={player.score}
                  onChangeText={(value) => onPlayerFieldChange?.(teamKey, index, 'score', value.replace(/[^0-9]/g, ''))}
                  style={[styles.playerInput, styles.centerText, !player.score.trim() && styles.emptyFieldInput]}
                  placeholder=""
                  keyboardType="numeric"
                />
              ) : (
                <Text style={[styles.playerText, styles.centerText, !player.score.trim() && styles.emptyValueText]}>
                  {player.score.trim() || '--'}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ScoresheetSheet(props: ScoresheetSheetProps) {
  const {
    draft,
    editable,
    onMetaFieldChange,
    onOfficialFieldChange,
    onTeamFieldChange,
    onPlayerFieldChange,
  } = props;

  return (
    <View style={styles.paper}>
      <View style={styles.headerRow}>
        <View style={styles.headerLogoBox}>
          <Text style={styles.headerLogoText}>MKKA</Text>
          <Text style={styles.headerLogoSubtext}>Official Sheet</Text>
        </View>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerOverline}>Maharashtra Kho-Kho Association</Text>
          <Text style={styles.headerTitle}>Official Match Scoresheet</Text>
          <Text style={styles.headerSubtitle}>Preview, correction, and final confirmation document</Text>
        </View>
        <View style={styles.headerLegendBox}>
          <Text style={styles.legendTitle}>Legend</Text>
          <Text style={styles.legendText}>Yellow cells need manual entry.</Text>
          <Text style={styles.legendText}>This sheet uses dummy OCR data.</Text>
        </View>
      </View>

      <View style={styles.infoBand}>
        <View style={styles.infoRow}>
          <SheetField
            label="Tournament"
            value={draft.tournament}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('tournament', value)}
            width="38%"
          />
          <SheetField
            label="Category"
            value={draft.category}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('category', value)}
            width="18%"
          />
          <SheetField
            label="Stage"
            value={draft.stage}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('stage', value)}
            width="18%"
          />
          <SheetField
            label="Toss Winner"
            value={draft.tossWinner}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('tossWinner', value)}
            width="22%"
          />
        </View>

        <View style={styles.infoRow}>
          <SheetField
            label="Date"
            value={draft.date}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('date', value)}
            width="20%"
          />
          <SheetField
            label="Time"
            value={draft.time}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('time', value)}
            width="20%"
          />
          <SheetField
            label="Venue"
            value={draft.venue}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('venue', value)}
            width="36%"
          />
          <SheetField
            label="Court No"
            value={draft.courtNo}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('courtNo', value)}
            width="10%"
            align="center"
          />
          <SheetField
            label="Match No"
            value={draft.matchNo}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('matchNo', value)}
            width="10%"
            align="center"
          />
        </View>
      </View>

      <View style={styles.teamsRow}>
        <TeamPanel
          teamKey="teamA"
          title="Team A"
          team={draft.teamA}
          editable={editable}
          onTeamFieldChange={onTeamFieldChange}
          onPlayerFieldChange={onPlayerFieldChange}
        />
        <View style={styles.middleDivider} />
        <TeamPanel
          teamKey="teamB"
          title="Team B"
          team={draft.teamB}
          editable={editable}
          onTeamFieldChange={onTeamFieldChange}
          onPlayerFieldChange={onPlayerFieldChange}
        />
      </View>

      <View style={styles.footerBlock}>
        <View style={styles.infoRow}>
          <SheetField
            label="Referee 1"
            value={draft.officials.referee1}
            editable={editable}
            onChangeText={(value) => onOfficialFieldChange?.('referee1', value)}
            width="24%"
          />
          <SheetField
            label="Referee 2"
            value={draft.officials.referee2}
            editable={editable}
            onChangeText={(value) => onOfficialFieldChange?.('referee2', value)}
            width="24%"
          />
          <SheetField
            label="Scorer"
            value={draft.officials.scorer}
            editable={editable}
            onChangeText={(value) => onOfficialFieldChange?.('scorer', value)}
            width="24%"
          />
          <SheetField
            label="Timekeeper"
            value={draft.officials.timekeeper}
            editable={editable}
            onChangeText={(value) => onOfficialFieldChange?.('timekeeper', value)}
            width="24%"
          />
        </View>

        <View style={styles.infoRow}>
          <SheetField
            label="Result"
            value={draft.result}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('result', value)}
            width="38%"
          />
          <SheetField
            label="Remarks"
            value={draft.remarks}
            editable={editable}
            onChangeText={(value) => onMetaFieldChange?.('remarks', value)}
            width="58%"
            multiline
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {
    width: 1480,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#111111',
    padding: 18,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#111111',
    minHeight: 110,
  },
  headerLogoBox: {
    width: 170,
    borderRightWidth: 2,
    borderRightColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
  },
  headerLogoText: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 1.2,
    color: '#111111',
  },
  headerLogoSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: '#333333',
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 18,
  },
  headerOverline: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#333333',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#111111',
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Nunito_500Medium',
    color: '#4A4A4A',
  },
  headerLegendBox: {
    width: 230,
    borderLeftWidth: 2,
    borderLeftColor: '#111111',
    padding: 12,
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FBFBFB',
  },
  legendTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#111111',
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
    color: '#555555',
  },
  infoBand: {
    borderWidth: 2,
    borderColor: '#111111',
    gap: 0,
  },
  footerBlock: {
    borderWidth: 2,
    borderColor: '#111111',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 10,
  },
  fieldCell: {
    gap: 5,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
    color: '#111111',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  fieldInput: {
    minHeight: 38,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#111111',
  },
  fieldInputMultiline: {
    minHeight: 70,
  },
  emptyFieldInput: {
    backgroundColor: '#FFF2CC',
  },
  fieldValue: {
    minHeight: 38,
    borderWidth: 1,
    borderColor: '#111111',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
  },
  fieldValueMultiline: {
    minHeight: 70,
  },
  fieldValueText: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#111111',
  },
  emptyValueText: {
    color: '#9A9A9A',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  middleDivider: {
    width: 2,
    backgroundColor: '#111111',
  },
  teamPanel: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#111111',
  },
  teamHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#111111',
    backgroundColor: '#F7F7F7',
  },
  teamHeaderText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#111111',
    textTransform: 'uppercase',
  },
  totalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    color: '#555555',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#111111',
  },
  inlineFieldsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#111111',
  },
  playersTable: {
    paddingBottom: 0,
  },
  playersHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    borderBottomWidth: 2,
    borderBottomColor: '#111111',
  },
  playersDataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
    minHeight: 36,
  },
  tableHeaderCell: {
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    color: '#111111',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#111111',
  },
  tableDataCell: {
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#111111',
    paddingHorizontal: 6,
  },
  serialCell: {
    width: 54,
  },
  playerNameCell: {
    flex: 1,
  },
  scoreCell: {
    width: 70,
  },
  tableIndexText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: '#555555',
    textAlign: 'center',
  },
  playerInput: {
    minHeight: 34,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    fontFamily: 'Nunito_500Medium',
    color: '#111111',
  },
  playerText: {
    fontSize: 13,
    fontFamily: 'Nunito_500Medium',
    color: '#111111',
  },
  leftText: {
    textAlign: 'left',
  },
  centerText: {
    textAlign: 'center',
  },
});
