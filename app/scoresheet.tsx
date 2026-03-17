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

interface StaffInfo {
  coach: string;
  manager: string;
  supportStaff: string;
  substitutes: string[];
}

interface EventRow {
  playerNo: string;
  time: string;
  remark: string;
}

interface TurnBatch {
  i: string;
  ii: string;
  iii: string;
  iv: string;
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
          <View style={[styles.cell, {width: 40, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>No</Text>
          </View>
          <View style={[styles.cell, {flex: 2, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Player Name</Text>
          </View>
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
        {players.map((p, i) => (
          <View key={i} style={[styles.tableRow, { borderColor: colors.border }]}>
            <View style={[styles.cell, {width: 40, borderColor: colors.border}]}>
              <Text style={[styles.cellText, { color: colors.textTertiary }]}>{i + 1}</Text>
            </View>
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 2 }]}
              value={p.name}
              onChangeText={(text) => update(i, 'name', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={p.i}
              onChangeText={(text) => update(i, 'i', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={p.ii}
              onChangeText={(text) => update(i, 'ii', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={p.iii}
              onChangeText={(text) => update(i, 'iii', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={p.iv}
              onChangeText={(text) => update(i, 'iv', text)}
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
  const update = (idx: number, field: keyof DefenseRow, val: string) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: val };
    setRows(next);
  };

  return (
    <View style={[styles.teamSection, styles.turnTable]}>
      <Text style={[styles.teamTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={[styles.cell, {flex: 1, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>I1</Text>
          </View>
          <View style={[styles.cell, {flex: 1, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>I2</Text>
          </View>
          <View style={[styles.cell, {flex: 1, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>I3</Text>
          </View>
          <View style={[styles.cell, {flex: 1, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>II1</Text>
          </View>
          <View style={[styles.cell, {flex: 1, borderColor: colors.border, backgroundColor: colors.primaryLight}]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>II2</Text>
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
                value={r.i1}
                onChangeText={(text) => update(i, 'i1', text)}
              />
            </View>
            <View style={[styles.dataCell, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.i2}
                onChangeText={(text) => update(i, 'i2', text)}
              />
            </View>
            <View style={[styles.dataCell, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.i3}
                onChangeText={(text) => update(i, 'i3', text)}
              />
            </View>
            <View style={[styles.dataCell, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.ii1}
                onChangeText={(text) => update(i, 'ii1', text)}
              />
            </View>
            <View style={[styles.dataCell, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.ii2}
                onChangeText={(text) => update(i, 'ii2', text)}
              />
            </View>
            <View style={styles.subInputs}>
              <TextInput
                style={[styles.smallSubInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.iii1}
                onChangeText={(text) => update(i, 'iii1', text)}
              />
              <TextInput
                style={[styles.smallSubInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.iii2}
                onChangeText={(text) => update(i, 'iii2', text)}
              />
            </View>
            <View style={[styles.dataCell, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={r.iv1}
                onChangeText={(text) => update(i, 'iv1', text)}
              />
            </View>
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

const EventTable: React.FC<{
  label: string;
  rows: EventRow[];
  setRows: (r: EventRow[]) => void;
  colors: any;
}> = ({ label, rows, setRows, colors }) => {
  const update = (idx: number, field: keyof EventRow, val: string) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: val };
    setRows(next);
  };

  return (
    <View style={styles.eventSection}>
      <Text style={[styles.sectionLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.table}>
        <View style={[styles.tableHeader, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
          <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Player No</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Time</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Remark</Text>
          </View>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={[styles.tableRow, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={r.playerNo}
              onChangeText={(text) => update(i, 'playerNo', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={r.time}
              onChangeText={(text) => update(i, 'time', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={r.remark}
              onChangeText={(text) => update(i, 'remark', text)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const PointsTable: React.FC<{
  rows: PointsRow[];
  setRows: (r: PointsRow[]) => void;
  colors: any;
}> = ({ rows, setRows, colors }) => {
  const addRow = () => setRows([...rows, { defenderNo: '', attackerNo: '', runTime: '', perTime: '', symbol: '', points: '' }]);
  const update = (idx: number, field: keyof PointsRow, val: string) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: val };
    setRows(next);
  };

  return (
    <View style={styles.pointsSection}>
      <Text style={[styles.sectionLabel, { color: colors.text }]}>POINTS SCORED BY TEAM</Text>
      <View style={styles.table}>
        <View style={[styles.tableHeader, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
          <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Defender No</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Attacker No</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Run Time</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Per Time</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Symbol</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.primary }]}>Points</Text>
          </View>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={[styles.tableRow, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={r.defenderNo}
              onChangeText={(text) => update(i, 'defenderNo', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={r.attackerNo}
              onChangeText={(text) => update(i, 'attackerNo', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={r.runTime}
              onChangeText={(text) => update(i, 'runTime', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={r.perTime}
              onChangeText={(text) => update(i, 'perTime', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={r.symbol}
              onChangeText={(text) => update(i, 'symbol', text)}
            />
            <TextInput
              style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
              value={r.points}
              onChangeText={(text) => update(i, 'points', text)}
            />
          </View>
        ))}
      </View>
      <Pressable style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={addRow}>
        <Text style={[styles.addButtonText, { color: colors.white }]}>Add Row</Text>
      </Pressable>
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

  const [staff, setStaff] = useState<StaffInfo>({
    coach: '',
    manager: '',
    supportStaff: '',
    substitutes: Array(5).fill(''),
  });

  const [lateEntries, setLateEntries] = useState<EventRow[]>([{ playerNo: '', time: '', remark: '' }]);
  const [outOfField, setOutOfField] = useState<EventRow[]>([{ playerNo: '', time: '', remark: '' }]);
  const [warnings, setWarnings] = useState<EventRow[]>([{ playerNo: '', time: '', remark: '' }]);
  const [dreamRuns, setDreamRuns] = useState<EventRow[]>([{ playerNo: '', time: '', remark: '' }]);

  const [batches, setBatches] = useState<TurnBatch[]>([
    { i: '', ii: '', iii: '', iv: '' },
    { i: '', ii: '', iii: '', iv: '' },
  ]);

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

  return (
    <LinearGradient
      colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.text }]}>Kho-Kho Scoresheet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <HeaderSection info={info} setInfo={setInfo} colors={colors} />

        <View style={styles.teamsContainer}>
          <View style={styles.teamRow}>
            <TeamSection title="TEAM A" players={teamA} setPlayers={setTeamA} colors={colors} />
            <DefenseTurnTable title="Defense Turns - Team A" rows={defenseA} setRows={setDefenseA} colors={colors} />
            <ChaseTurnTable title="Chase Turns - Team A" rows={chaseA} setRows={setChaseA} colors={colors} />
          </View>
          <View style={styles.teamRow}>
            <TeamSection title="TEAM B" players={teamB} setPlayers={setTeamB} colors={colors} />
            <DefenseTurnTable title="Defense Turns - Team B" rows={defenseB} setRows={setDefenseB} colors={colors} />
            <ChaseTurnTable title="Chase Turns - Team B" rows={chaseB} setRows={setChaseB} colors={colors} />
          </View>
        </View>

        <View style={styles.staffSection}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Team Staff</Text>
          <View style={styles.staffGrid}>
            <View style={styles.staffField}>
              <Text style={[styles.staffLabel, { color: colors.textSecondary }]}>Coach:</Text>
              <TextInput
                style={[styles.staffInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={staff.coach}
                onChangeText={(text) => setStaff({ ...staff, coach: text })}
              />
            </View>
            <View style={styles.staffField}>
              <Text style={[styles.staffLabel, { color: colors.textSecondary }]}>Manager:</Text>
              <TextInput
                style={[styles.staffInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={staff.manager}
                onChangeText={(text) => setStaff({ ...staff, manager: text })}
              />
            </View>
            <View style={styles.staffField}>
              <Text style={[styles.staffLabel, { color: colors.textSecondary }]}>Support Staff:</Text>
              <TextInput
                style={[styles.staffInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={staff.supportStaff}
                onChangeText={(text) => setStaff({ ...staff, supportStaff: text })}
              />
            </View>
          </View>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Substitutes</Text>
          <View style={styles.substitutesGrid}>
            {staff.substitutes.map((s, i) => (
              <TextInput
                key={i}
                style={[styles.substituteInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
                value={s}
                onChangeText={(text) => {
                  const arr = [...staff.substitutes];
                  arr[i] = text;
                  setStaff({ ...staff, substitutes: arr });
                }}
              />
            ))}
          </View>
        </View>

        <EventTable label="Late Entry" rows={lateEntries} setRows={setLateEntries} colors={colors} />
        <EventTable label="Out of Field" rows={outOfField} setRows={setOutOfField} colors={colors} />
        <EventTable label="Warning" rows={warnings} setRows={setWarnings} colors={colors} />
        <EventTable label="Dream Run" rows={dreamRuns} setRows={setDreamRuns} colors={colors} />

        <View style={styles.batchesSection}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Batches</Text>
          <View style={styles.table}>
            <View style={[styles.tableHeader, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
              <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
                <Text style={[styles.headerText, { color: colors.primary }]}>I</Text>
              </View>
              <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
                <Text style={[styles.headerText, { color: colors.primary }]}>II</Text>
              </View>
              <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
                <Text style={[styles.headerText, { color: colors.primary }]}>III</Text>
              </View>
              <View style={[styles.tableCell, styles.headerCell, { borderColor: colors.border }]}>
                <Text style={[styles.headerText, { color: colors.primary }]}>IV</Text>
              </View>
            </View>
            {batches.map((b, i) => (
              <View key={i} style={[styles.tableRow, { borderColor: colors.border }]}>
                <TextInput
                  style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
                  value={b.i}
                  onChangeText={(text) => {
                    const next = [...batches];
                    next[i] = { ...next[i], i: text };
                    setBatches(next);
                  }}
                />
                <TextInput
                  style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
                  value={b.ii}
                  onChangeText={(text) => {
                    const next = [...batches];
                    next[i] = { ...next[i], ii: text };
                    setBatches(next);
                  }}
                />
                <TextInput
                  style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
                  value={b.iii}
                  onChangeText={(text) => {
                    const next = [...batches];
                    next[i] = { ...next[i], iii: text };
                    setBatches(next);
                  }}
                />
                <TextInput
                  style={[styles.tableInput, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text, flex: 1 }]}
                  value={b.iv}
                  onChangeText={(text) => {
                    const next = [...batches];
                    next[i] = { ...next[i], iv: text };
                    setBatches(next);
                  }}
                />
              </View>
            ))}
          </View>
        </View>

        <PointsTable rows={points} setRows={setPoints} colors={colors} />

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
    flexDirection: 'column',
  },
  teamRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start', // Ensure tables align at the top
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
    borderRadius: 0, // Remove rounded corners for official look
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
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
  eventSection: { marginBottom: 16 },
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
    width: '48%',
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
  substitutesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  substituteInput: {
    width: '18%',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
    fontSize: 10,
    fontFamily: 'Nunito_500Medium',
    marginBottom: 4,
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
});