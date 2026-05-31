import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- DATA STRUCTURES ---

const COLORS = {
  primary: '#065F46', // Deep Emerald Green
  secondary: '#ECFDF5', // Light Mint tint
  text: '#111827', // Dark Charcoal
  accent: '#059669',
  card: '#FFFFFF',
  border: '#D1FAE5',
};

const TIMELINE_DATA = [
  {
    step: '1',
    time: 'صبحِ صادق',
    title: 'Bidear Hona',
    dua: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ',
    translation: 'Tamam tareefen us Allah k liye hain jis ne hamain marne k baad zinda kiya aur usi ki taraf lautna hai.',
  },
  {
    step: '2',
    time: 'نماز سے قبل',
    title: 'Wudu & Taharat',
    dua: 'اَللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    translation: 'Ay Allah! Main teri panah mangta hun napak jinon (nar aur madah) se.',
  },
  {
    step: '3',
    time: 'طلوعِ آفتاب',
    title: 'Fajr & Ishraq',
    detail: 'Sunnat-e-Fajr aur Ishraq ki namaz ka ihtimam.',
  },
  {
    step: '4',
    time: 'دن کا آغاز',
    title: 'Rizq-e-Halal',
    detail: 'Karobar aur naukri me Sunnat tariqon ka ihtimam.',
  },
  {
    step: '5',
    time: 'قيلولہ',
    title: 'Midday Rest',
    detail: 'Zohar k baad thori der aram karna Sunnat hai.',
  },
  {
    step: '6',
    time: 'غروبِ آفتاب تا نیند',
    title: 'Evening & Sleep',
    detail: 'Tasbeeh-e-Fatimi, Bistar jharhna, Ayah al-Kursi.',
  },
];

const CONTEXTUAL_DUAS = [
  {
    title: 'Ghar se nikalte waqt',
    dua: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    translation: 'Allah k naam se, maine Allah par bharosa kiya, gunaho se bachne aur naiki karne ki quwwat Allah hi ki taraf se hai.',
  },
  {
    title: 'Bazaar me dakhil hote waqt',
    dua: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    translation: 'Allah k siwa koi mabood nahi, wo akela hai uska koi shareek nahi...',
  },
  {
    title: 'Naya Libas pehente waqt',
    dua: 'اَللّٰهُمَّ لَكَ الْحَمْدُ اَنْتَ كَسَوْتَنِيْهِ، اَسْئَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ',
    translation: 'Ay Allah! Tere hi liye tareef hai, tune mujhe ye pehnaya...',
  },
  {
    title: 'Aina dekhte waqt',
    dua: 'اَللّٰهُمَّ اَنْتَ حَسَّنْتَ خَلْقِيْ فَحَسِّنْ خُلُقِيْ',
    translation: 'Ay Allah! Tune meri soorat achi banayi, meri seerat (akhlaq) bhi achi kar de.',
  },
  {
    title: 'Khane k baad',
    dua: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ',
    translation: 'Tamam tareefen us Allah k liye jis ne hamain khilaya, pilaya aur Musalman banaya.',
  },
];

const AZKAR_DATA = [
  { id: 1, title: 'Ayat al-Kursi', target: 1, text: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...' },
  { id: 2, title: '3 Qul', target: 3, text: 'Surah Ikhlas, Falaq, Nas' },
  { id: 3, title: 'Bismillahillazi...', target: 3, text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ...' },
  { id: 4, title: 'Raditu Billahi...', target: 3, text: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا...' },
  { id: 5, title: 'Hasbiyallahu...', target: 7, text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ...' },
  { id: 6, title: 'Ya Hayyu Ya Qayyum...', target: 1, text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ...' },
  { id: 7, title: 'Subhanallahi wa Bihmdihi', target: 100, text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ' },
  { id: 8, title: 'Sayyidul Istighfar', target: 1, text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ...' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Timeline');
  const [azkarCounts, setAzkarCounts] = useState(
    AZKAR_DATA.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );

  const incrementZikr = (id, target) => {
    if (azkarCounts[id] < target) {
      setAzkarCounts({ ...azkarCounts, [id]: azkarCounts[id] + 1 });
    }
  };

  const resetZikr = (id) => {
    setAzkarCounts({ ...azkarCounts, [id]: 0 });
  };

  const renderTimeline = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headerTitle}>24-Hour Sunnat</Text>
      {TIMELINE_DATA.map((item, index) => (
        <View key={index} style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepText}>{item.step}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.timeUrdu}>{item.time}</Text>
              <Text style={styles.titleEnglish}>{item.title}</Text>
            </View>
          </View>
          {item.dua && (
            <View style={styles.duaBox}>
              <Text style={styles.arabicText}>{item.dua}</Text>
              <Text style={styles.urduTranslation}>{item.translation}</Text>
            </View>
          )}
          {item.detail && <Text style={styles.detailText}>{item.detail}</Text>}
        </View>
      ))}
    </ScrollView>
  );

  const renderDuas = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headerTitle}>Contextual Duas</Text>
      {CONTEXTUAL_DUAS.map((item, index) => (
        <View key={index} style={styles.duaCard}>
          <Text style={styles.duaCategory}>{item.title}</Text>
          <Text style={styles.arabicTextLarge}>{item.dua}</Text>
          <View style={styles.divider} />
          <Text style={styles.urduTranslation}>{item.translation}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderAzkar = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headerTitle}>Digital Tasbeeh</Text>
      {AZKAR_DATA.map((item) => {
        const isDone = azkarCounts[item.id] === item.target;
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => incrementZikr(item.id, item.target)}
            onLongPress={() => resetZikr(item.id)}
            style={[styles.zikrCard, isDone && styles.zikrCardDone]}
          >
            <View style={styles.zikrInfo}>
              <Text style={styles.zikrTitle}>{item.title}</Text>
              <Text style={styles.zikrText}>{item.text}</Text>
              <Text style={styles.zikrTarget}>Target: {item.target}x</Text>
            </View>
            <View style={[styles.counterCircle, isDone && styles.counterCircleDone]}>
              <Text style={styles.counterText}>
                {isDone ? <MaterialCommunityIcons name="check" size={24} color="white" /> : azkarCounts[item.id]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.mainContainer}>
        {activeTab === 'Timeline' && renderTimeline()}
        {activeTab === 'Duas' && renderDuas()}
        {activeTab === 'Azkar' && renderAzkar()}
      </View>

      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('Timeline')} style={styles.tabItem}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color={activeTab === 'Timeline' ? COLORS.primary : '#9CA3AF'}
          />
          <Text style={[styles.tabLabel, activeTab === 'Timeline' && styles.tabLabelActive]}>Daily</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Duas')} style={styles.tabItem}>
          <MaterialCommunityIcons
            name="hands-pray"
            size={24}
            color={activeTab === 'Duas' ? COLORS.primary : '#9CA3AF'}
          />
          <Text style={[styles.tabLabel, activeTab === 'Duas' && styles.tabLabelActive]}>Duas</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Azkar')} style={styles.tabItem}>
          <MaterialCommunityIcons
            name="dots-horizontal-circle-outline"
            size={24}
            color={activeTab === 'Azkar' ? COLORS.primary : '#9CA3AF'}
          />
          <Text style={[styles.tabLabel, activeTab === 'Azkar' && styles.tabLabelActive]}>Azkar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  // Timeline Styles
  timelineCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeUrdu: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'left',
  },
  titleEnglish: {
    fontSize: 14,
    color: '#6B7280',
  },
  duaBox: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  arabicText: {
    fontSize: 20,
    color: COLORS.primary,
    textAlign: 'right',
    lineHeight: 32,
    fontFamily: 'System', // Fallback for Arabic
  },
  arabicTextLarge: {
    fontSize: 24,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 40,
    marginVertical: 12,
  },
  urduTranslation: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'right',
    marginTop: 8,
    lineHeight: 22,
  },
  detailText: {
    fontSize: 15,
    color: COLORS.text,
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Dua Tab Styles
  duaCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  duaCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  // Azkar Styles
  zikrCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  zikrCardDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  zikrInfo: {
    flex: 1,
    marginRight: 12,
  },
  zikrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  zikrText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  zikrTarget: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    marginTop: 4,
  },
  counterCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  counterCircleDone: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#fff',
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  // Tab Bar Styles
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: COLORS.card,
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
