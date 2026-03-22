import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppSettings } from '@/context/AppSettingsContext';

interface MatchInfo {
  tournament: string;
  venue: string;
  date: string;
  time: string;
  courtNo: string;
  matchNo: string;
  league: string;
  category: string;
  tossWonBy: string;
  choice: string;
}

interface PlayerRow {
  name: string;
  i: string;
  ii: string;
  iii: string;
  iv: string;
}

interface DefenseRow {
  i1: string;
  i2: string;
  i3: string;
  ii1: string;
  ii2: string;
  iii1: string;
  iii2: string;
  iv1: string;
}

interface ChaseRow {
  i: string;
  ii: string;
  iii: string;
  iv: string;
}

interface TeamStaffState {
  coach: string;
  manager: string;
  supportStaff: string;
  substitutes: string[];
}

interface CombinedEventRow {
  lateEntry: string;
  outOfField: string;
  warning: string;
  dreamRun: string;
}

interface TurnBatch {
  i1: string;
  i2: string;
  i3: string;
  ii1: string;
  ii2: string;
  ii3: string;
  ii4: string;
  iii1: string;
  iii2: string;
  iii3: string;
  iii4: string;
  iv1: string;
}

interface PointsRow {
  defenderNo: string;
  attackerNo: string;
  runTime: string;
  perTime: string;
  symbol: string;
  points: string;
}

interface ScoreSummary {
  teamAScore: string;
  teamBScore: string;
  grandTotal: string;
  time: string;
  remarks: string;
}

interface Officials {
  scorer: string;
  umpire1: string;
  umpire2: string;
  postUmpire1: string;
  postUmpire2: string;
  referee: string;
  dugout: string;
  timekeeper: string;
}

const HeaderSection: React.FC<{
  info: MatchInfo;
  setInfo: (i: MatchInfo) => void;
  colors: any;
}> = ({ info, setInfo, colors }) => (
  <View style={[styles.headerSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <Text style={[styles.headerTitle, { color: colors.text }]}>MAHARASHTRA KHO KHO ASSOCIATION</Text>
    <View style={styles.headerGrid}>
      {[
        ['Tournament', 'tournament'],
        ['Venue', 'venue'],
        ['Date', 'date'],
        ['Time', 'time'],
        ['Court No', 'courtNo'],
        ['Match No', 'matchNo'],
        ['League/Knockout', 'league'],
        ['Category', 'category'],
        ['Toss won by', 'tossWonBy'],
        ['Choice (Def/Chase)', 'choice'],
      ].map(([label, key]) => (
        <View key={key} style={styles.headerField}>
          <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>{label}:</Text>
          <TextInput
            style={[styles.headerInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
            value={(info as any)[key]}
            onChangeText={(text) => setInfo({ ...info, [key]: text })}
          />
        </View>
      ))}
    </View>
  </View>
);

const TeamSection: React.FC<{
  title: string;
  players: PlayerRow[];
  setPlayers: (p: PlayerRow[]) => void;
  colors: any;
}> = ({ title, players, setPlayers, colors }) => {
  const update = (idx: number, field: keyof PlayerRow, val: string) => {
    const next = [...players];
    next[idx] = { ...next[idx], [field]: val };
    setPlayers(next);
  };

  return (
    <View style={[styles.teamSection, styles.playerTable]}>
      <Text style={[styles.teamTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={[styles.cell, { width: 40, borderColor: colors.border, backgroundColor: colors.primaryLight }]}> 
            <Text style={[styles.headerText, { color: colors.primary }]}>No</Text>
          </View>
          <View style={[styles.cell, { flex: 3, borderColor: colors.border, backgroundColor: colors.primaryLight }]}> 
            <Text style={[styles.headerText, { color: colors.primary }]}>Player Name</Text>
          </View>

        </View>
        {players.map((p, i) => (
          <View key={i} style={[styles.tableRow, { borderColor: colors.border }]}>
            <View style={[styles.cell, {width: 40, borderColor: colors.border}]}>
              <Text style={[styles.cellText, { color: colors.textTertiary }]}>{i + 1}</Text>
            </View>
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 3 }]}
              value={p.name}
              onChangeText={(text) => update(i, 'name', text)}
            />

          </View>
        ))}
      </View>
    </View>
  );
};

const DefenseTurnTable: React.FC<{
  title: string;
  rows: DefenseRow[];
  setRows: (r: DefenseRow[]) => void;
  colors: any;
}> = ({ title, rows, setRows, colors }) => {
  const groups = [
    { label: 'I', span: 3 },
    { label: 'II', span: 2 },
    { label: 'III', span: 2 },
    { label: 'IV', span: 1 },
  ];

  const update = (idx: number, field: keyof DefenseRow, val: string) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: val };
    setRows(next);
  };

  return (
    <View style={[styles.teamSection, styles.turnTable]}>
      <Text style={[styles.teamTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.table}>
        <View style={[styles.tableHeader, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}> 
          {groups.map((group, idx) => (
            <View
              key={group.label}
              style={[
                styles.groupHeaderCell,
                { flex: group.span, borderRightWidth: idx === groups.length - 1 ? 1 : 2, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.headerText, { color: colors.primary }]}>{group.label}</Text>
            </View>
          ))}
        </View>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={[styles.tableRow, { borderColor: colors.border }]}> 
            {['i1', 'i2', 'i3', 'ii1', 'ii2', 'iii1', 'iii2', 'iv1'].map((field, colIdx) => (
              <TextInput
                key={`${rowIdx}-${field}`}
                value={(row as any)[field]}
                onChangeText={(text) => update(rowIdx, field as keyof DefenseRow, text)}
                style={[
                  styles.tableInput,
                  { flex: 1, borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, borderRightWidth: [3, 5, 7].includes(colIdx + 1) ? 2 : 1 },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const ChaseTurnTableGroup: React.FC<{
  title: string;
  rows: ChaseRow[];
  setRows: (r: ChaseRow[]) => void;
  colors: any;
}> = ({ title, rows, setRows, colors }) => {
  const update = (idx: number, field: keyof ChaseRow, val: string) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: val };
    setRows(next);
  };

  const batchLabels = [
    { label: 'I', field: 'i', flex: 3 },
    { label: 'II', field: 'ii', flex: 4 },
    { label: 'III', field: 'iii', flex: 4 },
    { label: 'IV', field: 'iv', flex: 1 },
  ];

  return (
    <View style={[styles.batchGroupWrapper, { flex: 1, marginHorizontal: 4 }]}>
      <Text style={[styles.batchGroupTitle, { color: colors.text, backgroundColor: colors.primaryLight, borderColor: colors.border }]}>{title}</Text>
      <View style={styles.table}>
        <View style={[styles.tableHeader, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
          {batchLabels.map((batch, idx) => (
            <View 
              key={batch.label} 
              style={[
                styles.cell,
                { 
                  flex: batch.flex, 
                  borderColor: colors.border,
                  borderRightWidth: idx < batchLabels.length - 1 ? 2 : 1,
                  backgroundColor: colors.primaryLight
                }
              ]}>
              <Text style={[styles.headerText, { color: colors.primary }]}>{batch.label}</Text>
            </View>
          ))}
        </View>
        {rows.map((r, i) => (
          <View key={i} style={[styles.tableRow, { borderColor: colors.border }]}>
            {batchLabels.map((batch, idx) => (
              <View 
                key={batch.label}
                style={[
                  styles.dataCell, 
                  { 
                    borderColor: colors.border,
                    flex: batch.flex,
                    borderRightWidth: idx < batchLabels.length - 1 ? 2 : 1,
                  }
                ]}>
                <TextInput
                  style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                  value={(r as any)[batch.field]}
                  onChangeText={(text) => update(i, batch.field as keyof ChaseRow, text)}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const ChaseTurnTable: React.FC<{
  title: string;
  rows: ChaseRow[];
  setRows: (r: ChaseRow[]) => void;
  colors: any;
}> = ({ title, rows, setRows, colors }) => {
  const update = (idx: number, field: keyof ChaseRow, val: string) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: val };
    setRows(next);
  };

  return (
    <View style={[styles.teamSection, styles.turnTable]}>
      <Text style={[styles.teamTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.table}>
        <View style={[styles.tableHeader, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
          <View style={[styles.cell, {flex: 1, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>I</Text>
          </View>
          <View style={[styles.cell, {flex: 1, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>II</Text>
          </View>
          <View style={[styles.cell, {flex: 1, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>III</Text>
          </View>
          <View style={[styles.cell, {flex: 1, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>IV</Text>
          </View>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={[styles.tableRow, { borderColor: colors.border }]}>
            <View style={[styles.dataCell, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.i}
                onChangeText={(text) => update(i, 'i', text)}
              />
            </View>
            <View style={[styles.dataCell, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.ii}
                onChangeText={(text) => update(i, 'ii', text)}
              />
            </View>
            <View style={[styles.dataCell, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.iii}
                onChangeText={(text) => update(i, 'iii', text)}
              />
            </View>
            <View style={[styles.dataCell, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.iv}
                onChangeText={(text) => update(i, 'iv', text)}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};



const TeamStaffSection: React.FC<{
  team: 'teamA' | 'teamB';
  teamStaff: TeamStaffState;
  setTeamStaff: (team: 'teamA' | 'teamB', staff: TeamStaffState) => void;
  addSubstitute: (team: 'teamA' | 'teamB') => void;
  handleSubstituteChange: (team: 'teamA' | 'teamB', index: number, value: string) => void;
  colors: any;
}> = ({ team, teamStaff, setTeamStaff, addSubstitute, handleSubstituteChange, colors }) => {
  return (
    <View style={styles.staffSection}>
      <Text style={[styles.sectionLabel, { color: colors.text }]}>TEAM {team === 'teamA' ? 'A' : 'B'} Staff</Text>
      <View style={styles.staffGrid}>
        <View style={styles.staffField}>
          <Text style={[styles.staffLabel, { color: colors.textSecondary }]}>Coach:</Text>
          <TextInput
            style={[styles.staffInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
            value={teamStaff.coach}
            onChangeText={(text) => setTeamStaff(team, { ...teamStaff, coach: text })}
          />
        </View>
        <View style={styles.staffField}>
          <Text style={[styles.staffLabel, { color: colors.textSecondary }]}>Manager:</Text>
          <TextInput
            style={[styles.staffInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
            value={teamStaff.manager}
            onChangeText={(text) => setTeamStaff(team, { ...teamStaff, manager: text })}
          />
        </View>
        <View style={styles.staffField}>
          <Text style={[styles.staffLabel, { color: colors.textSecondary }]}>Support Staff:</Text>
          <TextInput
            style={[styles.staffInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
            value={teamStaff.supportStaff}
            onChangeText={(text) => setTeamStaff(team, { ...teamStaff, supportStaff: text })}
          />
        </View>
      </View>
      <View style={styles.substituteSection}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Substitutes</Text>
        {teamStaff.substitutes.map((sub, index) => (
          <View key={index} style={styles.substituteRow}>
            <TextInput
              style={[styles.substituteInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
              placeholder={`Substitute ${index + 1}`}
              value={sub}
              onChangeText={(text) => handleSubstituteChange(team, index, text)}
            />
            {index === teamStaff.substitutes.length - 1 && (
              <Pressable style={[styles.substituteAddButton, { backgroundColor: colors.primary }]} onPress={() => addSubstitute(team)}>
                <Text style={{ color: colors.white }}>+</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const CombinedEventsTable: React.FC<{
  title: string;
  rows: CombinedEventRow[];
  setRows: (rows: CombinedEventRow[]) => void;
  colors: any;
}> = ({ title, rows, setRows, colors }) => {
  const update = (idx: number, field: keyof CombinedEventRow, val: string) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: val };
    setRows(next);
  };

  const eventTypes: { label: string; key: keyof CombinedEventRow }[] = [
    { label: 'Late Entry', key: 'lateEntry' },
    { label: 'Out of Field', key: 'outOfField' },
    { label: 'Warning', key: 'warning' },
    { label: 'Dream Run', key: 'dreamRun' },
  ];

  return (
    <View style={styles.eventSection}>
      <Text style={[styles.teamTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.table}>
        <View style={[styles.tableHeader, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
          {eventTypes.map(event => (
            <View key={event.key} style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
              <Text style={[styles.headerText, { color: colors.primary }]}>{event.label}</Text>
            </View>
          ))}
        </View>
        {rows.map((r, i) => (
          <View key={i} style={[styles.tableRow, { borderColor: colors.border }]}>
            {eventTypes.map(event => (
              <TextInput
                key={event.key}
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
                value={r[event.key]}
                onChangeText={(text) => update(i, event.key, text)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};


const BatchTableGroup: React.FC<{
  title: string;
  batches: TurnBatch[];
  setBatches: (b: TurnBatch[]) => void;
  colors: any;
}> = ({ title, batches, setBatches, colors }) => {

  const updateBatch = (rowIndex: number, field: keyof TurnBatch, value: string) => {
    const next = [...batches];
    next[rowIndex] = { ...next[rowIndex], [field]: value };
    setBatches(next);
  };

  const batchGroups = [
    { label: 'I', fields: ['i1', 'i2', 'i3'], flex: 3 },
    { label: 'II', fields: ['ii1', 'ii2', 'ii3', 'ii4'], flex: 4 },
    { label: 'III', fields: ['iii1', 'iii2', 'iii3', 'iii4'], flex: 4 },
    { label: 'IV', fields: ['iv1'], flex: 1 },
  ];

  return (
    <View style={[styles.batchGroupWrapper, { flex: 1, marginHorizontal: 4 }]}>
      <Text style={[styles.batchGroupTitle, { color: colors.text, backgroundColor: colors.primaryLight, borderColor: colors.border }]}>{title}</Text>
      <View style={styles.table}>
        <View style={[styles.tableHeader, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
          {batchGroups.map((group, idx) => (
            <View 
              key={group.label} 
              style={[
                styles.tableCell, 
                styles.headerCell, 
                { 
                  borderColor: '#000', 
                  flex: group.flex, 
                  borderRightWidth: idx < batchGroups.length - 1 ? 2 : 1,
                  paddingRight: 0,
                  paddingLeft: 0,
                }
              ]}>
              <Text style={[styles.headerText, { color: colors.primary }]}>{group.label}</Text>
            </View>
          ))}
        </View>
        {batches.map((b, i) => (
          <View key={i} style={[styles.tableRow, { borderColor: colors.border, flexDirection: 'row' }]}>
            {batchGroups.map((group, groupIndex) => (
              <View 
                key={group.label} 
                style={[
                  { 
                    flexDirection: 'row', 
                    flex: group.flex, 
                    borderRightWidth: groupIndex < batchGroups.length - 1 ? 2 : 1, 
                    borderColor: '#000',
                    paddingRight: 0,
                    paddingLeft: 0,
                  }
                ]}>
                {group.fields.map((field) => (
                  <TextInput
                    key={field}
                    style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
                    value={b[field as keyof TurnBatch]}
                    onChangeText={(text) => updateBatch(i, field as keyof TurnBatch, text)}
                  />
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const BatchesTable: React.FC<{
  batches: TurnBatch[];
  setBatches: (b: TurnBatch[]) => void;
  colors: any;
}> = ({ batches, setBatches, colors }) => {
  return (
    <View style={styles.batchesSection}>
      <Text style={[styles.sectionLabel, { color: colors.text }]}>Batches of Groups</Text>
      <View style={[styles.batchesContainer, { flexDirection: 'row' }]}>
        <BatchTableGroup title="Batches of group A" batches={batches} setBatches={setBatches} colors={colors} />
        <BatchTableGroup title="Batches of group B" batches={batches} setBatches={setBatches} colors={colors} />
      </View>
    </View>
  );
};


const PointsGridTable: React.FC<{ title: string; team: 'A' | 'B'; gridData: { [key: string]: string[] }; setGridData: (data: any) => void; colors: any }> = ({ title, team, gridData, setGridData, colors }) => {
  const labels = ['DEFENDER D-No.', 'ATTACKER A-No.', 'RUN TIME', 'PER TIME', 'SYMBOL'];
  const colCount = 15;

  const handleCellChange = (blockIdx: number, labelIdx: number, colIdx: number, value: string) => {
    const key = `team${team}_block${blockIdx}_row${labelIdx}`;
    const newData = { ...gridData };
    if (!newData[key]) newData[key] = Array(colCount).fill('');
    newData[key][colIdx] = value;
    setGridData(newData);
  };

  const getGridData = (blockIdx: number, labelIdx: number) => {
    const key = `team${team}_block${blockIdx}_row${labelIdx}`;
    return gridData[key] || Array(colCount).fill('');
  };

  return (
    <View style={styles.pointsGridWrapper}>
      <Text style={[styles.pointsGridLabel, { color: colors.text }]}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.pointsScrollContainer}>
        <View style={[styles.pointsGridContainer, { borderColor: '#000' }]}>
        {[0, 1].map((blockIdx) => (
          <View key={`block-${blockIdx}`}>
            {labels.map((label, labelIdx) => (
              <View key={`${blockIdx}-${labelIdx}`} style={styles.pointsGridRow}>
                <View style={[styles.pointsLabelCell, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <Text style={[styles.pointsLabelText, { color: colors.text }]}>{label}</Text>
                </View>
                <View style={styles.pointsGridCells}>
                  {Array.from({ length: colCount }).map((_, colIdx) => (
                    <TextInput
                      key={`col-${colIdx}`}
                      style={[styles.pointsGridCell, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg }]}
                      value={getGridData(blockIdx, labelIdx)[colIdx]}
                      onChangeText={(text) => handleCellChange(blockIdx, labelIdx, colIdx, text)}
                      placeholder=""
                      placeholderTextColor={colors.textSecondary}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
      </ScrollView>
    </View>
  );
};

const ScoreSummarySection: React.FC<{
  summary: ScoreSummary;
  setSummary: (s: ScoreSummary) => void;
  colors: any;
}> = ({ summary, setSummary, colors }) => (
  <View style={styles.summarySection}>
    <View style={styles.summaryGrid}>
      {[
        ['Team A Score', 'teamAScore'],
        ['Team B Score', 'teamBScore'],
        ['Grand Total', 'grandTotal'],
        ['Time', 'time'],
      ].map(([label, key]) => (
        <View key={key} style={styles.summaryField}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{label}:</Text>
          <TextInput
            style={[styles.summaryInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
            value={(summary as any)[key]}
            onChangeText={(text) => setSummary({ ...summary, [key]: text })}
          />
        </View>
      ))}
    </View>
    <View style={styles.remarksField}>
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Remarks:</Text>
      <TextInput
        style={[styles.remarksInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
        value={summary.remarks}
        onChangeText={(text) => setSummary({ ...summary, remarks: text })}
        multiline
      />
    </View>
  </View>
);

const OfficialsSection: React.FC<{
  officials: Officials;
  setOfficials: (o: Officials) => void;
  colors: any;
}> = ({ officials, setOfficials, colors }) => (
  <View style={styles.officialsSection}>
    <Text style={[styles.sectionLabel, { color: colors.text }]}>Officials</Text>
    <View style={styles.table}>
      {([
        ['Scorer', 'scorer'],
        ['Umpire 1', 'umpire1'],
        ['Umpire 2', 'umpire2'],
        ['Post Umpire 1', 'postUmpire1'],
        ['Post Umpire 2', 'postUmpire2'],
        ['Referee', 'referee'],
        ['Dugout', 'dugout'],
        ['Timekeeper', 'timekeeper'],
      ] as Array<[string, keyof Officials]>).map(([label, key]) => (
        <View key={key} style={[styles.tableRow, { borderColor: colors.border }]}>
          <Text style={[styles.tableCell, { color: colors.textSecondary, flex: 1 }]}>{label}</Text>
          <TextInput
            style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 2 }]}
            value={officials[key]}
            onChangeText={(text) => setOfficials({ ...officials, [key]: text })}
          />
        </View>
      ))}
    </View>
  </View>
);

export default function ScoresheetScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const { colors } = useAppSettings();

  const [info, setInfo] = useState<MatchInfo>({
    tournament: '',
    venue: '',
    date: '',
    time: '',
    courtNo: '',
    matchNo: '',
    league: '',
    category: '',
    tossWonBy: '',
    choice: '',
  });

  const [teamA, setTeamA] = useState<PlayerRow[]>(
    Array.from({ length: 12 }, () => ({ name: '', i: '', ii: '', iii: '', iv: '' }))
  );
  const [teamB, setTeamB] = useState<PlayerRow[]>(
    Array.from({ length: 12 }, () => ({ name: '', i: '', ii: '', iii: '', iv: '' }))
  );

  const [defenseA, setDefenseA] = useState<DefenseRow[]>(
    Array.from({ length: 12 }, () => ({ i1: '', i2: '', i3: '', ii1: '', ii2: '', iii1: '', iii2: '', iv1: '' }))
  );
  const [chaseA, setChaseA] = useState<ChaseRow[]>(
    Array.from({ length: 12 }, () => ({ i: '', ii: '', iii: '', iv: '' }))
  );
  const [defenseB, setDefenseB] = useState<DefenseRow[]>(
    Array.from({ length: 12 }, () => ({ i1: '', i2: '', i3: '', ii1: '', ii2: '', iii1: '', iii2: '', iv1: '' }))
  );
  const [chaseB, setChaseB] = useState<ChaseRow[]>(
    Array.from({ length: 12 }, () => ({ i: '', ii: '', iii: '', iv: '' }))
  );

  const [teamStaff, setTeamStaff] = useState<{teamA: TeamStaffState; teamB: TeamStaffState}>({
    teamA: { coach: '', manager: '', supportStaff: '', substitutes: [''] },
    teamB: { coach: '', manager: '', supportStaff: '', substitutes: [''] },
  });

  const addSubstitute = (team: 'teamA' | 'teamB') => {
    setTeamStaff((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        substitutes: [...prev[team].substitutes, ''],
      },
    }));
  };

  const handleSubstituteChange = (team: 'teamA' | 'teamB', index: number, value: string) => {
    setTeamStaff((prev) => {
      const newSubstitutes = [...prev[team].substitutes];
      newSubstitutes[index] = value;
      return {
        ...prev,
        [team]: {
          ...prev[team],
          substitutes: newSubstitutes,
        },
      };
    });
  };

  const setTeamStaffState = (team: 'teamA' | 'teamB', staff: TeamStaffState) => {
    setTeamStaff(prev => ({ ...prev, [team]: staff }));
  }

  const [combinedEventsA, setCombinedEventsA] = useState<CombinedEventRow[]>(
    Array.from({ length: 5 }, () => ({ lateEntry: '', outOfField: '', warning: '', dreamRun: '' }))
  );
  const [combinedEventsB, setCombinedEventsB] = useState<CombinedEventRow[]>(
    Array.from({ length: 5 }, () => ({ lateEntry: '', outOfField: '', warning: '', dreamRun: '' }))
  );


  const [batches, setBatches] = useState<TurnBatch[]>(
    Array.from({ length: 2 }, () => ({
      i1: '', i2: '', i3: '',
      ii1: '', ii2: '', ii3: '', ii4: '',
      iii1: '', iii2: '', iii3: '', iii4: '',
      iv1: '',
    }))
  );

  const [points, setPoints] = useState<PointsRow[]>([]);

  const [summary, setSummary] = useState<ScoreSummary>({
    teamAScore: '',
    teamBScore: '',
    grandTotal: '',
    time: '',
    remarks: '',
  });

  const [officials, setOfficials] = useState<Officials>({
    scorer: '',
    umpire1: '',
    umpire2: '',
    postUmpire1: '',
    postUmpire2: '',
    referee: '',
    dugout: '',
    timekeeper: '',
  });

  const [pointsGridData, setPointsGridData] = useState<{ [key: string]: string[] }>({});

  return (
    <LinearGradient
      colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.topTitle, { color: colors.text }]}>Kho-Kho Scoresheet</Text>
          <View style={{ width: 40 }} />
        </View>
        <HeaderSection info={info} setInfo={setInfo} colors={colors} />

        <View style={styles.teamsContainer}>
          <View style={styles.teamColumn}>
            <View style={styles.teamRow}>
              <TeamSection title="TEAM A" players={teamA} setPlayers={setTeamA} colors={colors} />
              <DefenseTurnTable title="Defense Turns - Team A" rows={defenseA} setRows={setDefenseA} colors={colors} />
              <ChaseTurnTable title="Chase Turns - Team A" rows={chaseA} setRows={setChaseA} colors={colors} />
            </View>
            <TeamStaffSection
              team="teamA"
              teamStaff={teamStaff.teamA}
              setTeamStaff={setTeamStaffState}
              addSubstitute={addSubstitute}
              handleSubstituteChange={handleSubstituteChange}
              colors={colors}
            />
          </View>

          <View style={styles.teamColumn}>
            <View style={styles.teamRow}>
              <TeamSection title="TEAM B" players={teamB} setPlayers={setTeamB} colors={colors} />
              <DefenseTurnTable title="Defense Turns - Team B" rows={defenseB} setRows={setDefenseB} colors={colors} />
              <ChaseTurnTable title="Chase Turns - Team B" rows={chaseB} setRows={setChaseB} colors={colors} />
            </View>
            <TeamStaffSection
              team="teamB"
              teamStaff={teamStaff.teamB}
              setTeamStaff={setTeamStaffState}
              addSubstitute={addSubstitute}
              handleSubstituteChange={handleSubstituteChange}
              colors={colors}
            />
          </View>
        </View>
        
        <View style={styles.eventsContainer}>
          <View style={styles.eventColumn}>
            <CombinedEventsTable title="Team A Events" rows={combinedEventsA} setRows={setCombinedEventsA} colors={colors} />
          </View>
          <View style={styles.eventColumn}>
            <CombinedEventsTable title="Team B Events" rows={combinedEventsB} setRows={setCombinedEventsB} colors={colors} />
          </View>
        </View>

        <BatchesTable batches={batches} setBatches={setBatches} colors={colors} />

        <View style={styles.pointsGridsWrapper}>
          <View style={styles.pointsGridColumn}>
            <PointsGridTable title="Points Scored By Team A" team="A" gridData={pointsGridData} setGridData={setPointsGridData} colors={colors} />
          </View>
          <View style={styles.pointsGridColumn}>
            <PointsGridTable title="Points Scored By Team B" team="B" gridData={pointsGridData} setGridData={setPointsGridData} colors={colors} />
          </View>
        </View>

        <ScoreSummarySection summary={summary} setSummary={setSummary} colors={colors} />

        <OfficialsSection officials={officials} setOfficials={setOfficials} colors={colors} />
      </ScrollView>
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
  scrollContent: { paddingHorizontal: 10 },
  headerSection: { marginBottom: 16 },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  headerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  headerField: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  headerLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 4,
  },
  headerInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  teamRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  teamSection: { 
    marginHorizontal: 2,
    flex: 1,
  },
  playerTable: {
    flex: 2,
  },
  turnTable: {
    flex: 1,
  },
  teamTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 0,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
  },
  groupHeaderCell: {
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 28,
    backgroundColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 36,
    maxHeight: 40,
  },
  cell: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 2,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dataCell: {
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  cellText: {
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
  },
  headerText: {
    fontSize: 10,
    fontFamily: 'Nunito_700Bold',
  },
  tableInput: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 2,
    paddingVertical: 2,
    fontSize: 10,
    fontFamily: 'Nunito_500Medium',
    backgroundColor: '#fff',
    minHeight: 28,
    textAlign: 'center',
    width: '100%',
  },
  subInputs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 2,
  },
  subInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 1,
    paddingVertical: 1,
    fontSize: 8,
    fontFamily: 'Nunito_500Medium',
    backgroundColor: '#fff',
    minHeight: 24,
    marginHorizontal: 0.5,
    textAlign: 'center',
  },
  smallSubInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 0.5,
    paddingVertical: 1,
    fontSize: 7,
    fontFamily: 'Nunito_500Medium',
    backgroundColor: '#fff',
    minHeight: 20,
    marginHorizontal: 0.5,
    textAlign: 'center',
  },
  defenseChaseSection: { marginBottom: 16 },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  eventSection: { flex: 1, marginBottom: 16, marginHorizontal: 5 },
  eventsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  pointsSection: { marginBottom: 16 },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  summarySection: { marginBottom: 16 },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryField: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 4,
  },
  summaryInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
  },
  remarksField: { marginTop: 8 },
  remarksInput: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
    minHeight: 60,
  },
  officialsSection: { marginBottom: 16 },
  staffSection: { marginBottom: 16 },
  staffGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  staffField: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '32%',
    marginBottom: 8,
  },
  staffLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 4,
  },
  staffInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
  },
  substituteSection: {
    marginTop: 10,
  },
  substituteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  substituteInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
  },
  substituteAddButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    backgroundColor: '#f0f0f0',
  },
  batchesSection: { marginBottom: 16 },
  batchesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  batchGroupWrapper: {
    flex: 1,
  },
  batchGroupTitle: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    paddingVertical: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderRadius: 3,
  },
  batchGroup: {
    flexDirection: 'row',
  },
  pointsGridsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  pointsGridColumn: {
    flex: 1,
  },
  pointsGridWrapper: {
    marginBottom: 8,
  },
  pointsGridLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
  },
  pointsGridContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  pointsGridRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  pointsLabelCell: {
    width: 110,
    paddingHorizontal: 6,
    paddingVertical: 6,
    justifyContent: 'center',
    borderRightWidth: 1,
    minHeight: 36,
  },
  pointsLabelText: {
    fontSize: 10,
    fontFamily: 'Nunito_600SemiBold',
  },
  pointsGridCells: {
    flexDirection: 'row',
    flex: 1,
  },
  pointsGridCell: {
    flex: 1,
    minHeight: 36,
    borderRightWidth: 1,
    paddingHorizontal: 1,
    paddingVertical: 4,
    fontSize: 9,
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
  },
});