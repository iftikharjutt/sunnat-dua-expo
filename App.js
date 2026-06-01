import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- STYLE CONSTANTS ---
const COLORS = {
  emerald: '#064E3B', // Deep Emerald Green
  mint: '#ECFDF5',    // Light Mint background
  charcoal: '#1F2937', // Dark Charcoal text
  white: '#FFFFFF',
  silver: '#9CA3AF',
  gold: '#D97706',
};

const { width } = Dimensions.get('window');

// --- DATA STRUCTURES ---

const TIMELINE_DATA = [
  {
    title: 'صبحِ صادق',
    sub: 'Bidear Hona',
    dua: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ',
    urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف لوٹنا ہے۔',
  },
  {
    title: 'نماز سے قبل',
    sub: 'Wudu & Taharat',
    dua: 'اَللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    urdu: 'اے اللہ! میں تیری پناہ مانگتا ہوں ناپاک جنوں (نر اور مادہ) سے۔',
  },
  {
    title: 'طلوعِ آفتاب',
    sub: 'Fajr & Ishraq',
    desc: 'Sunnat-e-Fajr aur Ishraq ki namaz ka ihtimam karein.',
  },
  {
    title: 'دن کا آغاز',
    sub: 'Rizq-e-Halal',
    desc: 'Business aur naukri me Sunnat tariqon aur eimandari ka ihtimam.',
  },
  {
    title: 'قيلولہ',
    sub: 'Midday Rest',
    desc: 'Zohar ke baad thori der aram karna Sunnat-e-Mubaraka hai.',
  },
  {
    title: 'غروبِ آفتاب تا نیند',
    sub: 'Evening & Sleeping',
    desc: 'Tasbeeh-e-Fatimi, Bistar jharhna aur Ayatul Kursi parh kar sona.',
  },
];

const CATEGORY_DUAS = [
  {
    cat: 'Ghar se nikalte waqt',
    dua: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    urdu: 'اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، گناہوں سے بچنے اور نیکی کرنے کی قوت اللہ ہی کی طرف سے ہے۔',
  },
  {
    cat: 'Bazaar me dakhil hote waqt',
    dua: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِیکَ لَهُ، لَهُ الْمُلْکُ وَلَهُ الْحَمْدُ، یُحْيِی وَیُمِیتُ وَهُوَ حَیٌّ لَا یَمُوتُ، بِیَدِهِ الْخَیْرُ وَهُوَ عَلَی کُلِّ شَیْءٍ قَدِیرٌ',
    urdu: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، بادشاہی اسی کی ہے اور تمام تعریف اسی کے لیے ہے...',
  },
  {
    cat: 'Naya Libas pehente waqt',
    dua: 'اَللّٰهُمَّ لَكَ الْحَمْدُ اَنْتَ كَسَوْتَنِيْهِ، اَسْئَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ',
    urdu: 'اے اللہ! تیرے ہی لیے تعریف ہے، تو نے مجھے یہ پہنایا، میں تجھ سے اس کی خیر اور جس کے لیے یہ بنایا گیا ہے اس کی خیر مانگتا ہوں۔',
  },
  {
    cat: 'Aina dekhte waqt',
    dua: 'اَللّٰهُمَّ اَنْتَ حَسَّنْتَ خَلْقِيْ فَحَسِّنْ خُلُقِيْ',
    urdu: 'اے اللہ! تو نے میری صورت اچھی بنائی، میری سیرت (اخلاق) بھی اچھی کر دے۔',
  },
  {
    cat: 'Khane ke baad',
    dua: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ',
    urdu: 'تمام تعریفیں اس اللہ کے لیے ہیں جس نے ہمیں کھلایا، پلایا اور مسلمان بنایا۔',
  },
  {
    cat: 'Majlis se uthte waqt',
    dua: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    urdu: 'اے اللہ! تو پاک ہے اپنی تعریف کے ساتھ، میں گواہی دیتا ہوں کہ تیرے سوا کوئی معبود نہیں، میں تجھ سے بخشش مانگتا ہوں اور تیری طرف توبہ کرتا ہوں۔',
  },
];

const AZKAR_LIST = [
  { id: 1, title: 'Ayat al-Kursi', target: 1, text: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...' },
  { id: 2, title: '3 Qul', target: 3, text: 'Surah Ikhlas, Falaq, Nas' },
  { id: 3, title: 'Bismillahillazi...', target: 3, text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ...' },
  { id: 4, title: 'Raditu Billahi...', target: 3, text: 'رَضِیتُ بِاللّٰہِ رَبًّا وَّ بِالْاِسْلَامِ دِیْنًا...' },
  { id: 5, title: 'Hasbiyallahu...', target: 7, text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ...' },
  { id: 6, title: 'Ya Hayyu Ya Qayyum...', target: 1, text: 'یَا حَیُّ یَا قَیُّومُ بِرَحْمَتِکَ اَسْتَغِیْثُ' },
  { id: 7, title: 'Subhanallahi wa Bihmdihi', target: 100, text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ' },
  { id: 8, title: 'Sayyidul Istighfar', target: 1, text: 'اَللّٰھُمَّ اَنْتَ رَبِّیْ لَا اِلٰہَ اِلَّا اَنْتَ خَلَقْتَنِیْ...' },
];

export default function App() {
  const [tab, setTab] = useState('Timeline');
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const initialCounts = {};
    AZKAR_LIST.forEach(a => initialCounts[a.id] = 0);
    setCounts(initialCounts);
  }, []);

  const handlePress = (id, target) => {
    if (counts[id] < target) {
      setCounts({ ...counts, [id]: counts[id] + 1 });
    }
  };

  const renderTimeline = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Daily Routine</Text>
      {TIMELINE_DATA.map((item, i) => (
        <View key={i} style={styles.timelineCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.urduHeader}>{item.title}</Text>
            <Text style={styles.englishHeader}>{item.sub}</Text>
          </View>
          {item.dua && <Text style={styles.arabicText}>{item.dua}</Text>}
          {item.urdu && <Text style={styles.urduText}>{item.urdu}</Text>}
          {item.desc && <Text style={styles.descText}>{item.desc}</Text>}
        </View>
      ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderDuas = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Masnoon Duas</Text>
      {CATEGORY_DUAS.map((item, i) => (
        <View key={i} style={styles.duaCard}>
          <Text style={styles.categoryLabel}>{item.cat}</Text>
          <Text style={styles.arabicTextLarge}>{item.dua}</Text>
          <View style={styles.divider} />
          <Text style={styles.urduText}>{item.urdu}</Text>
        </View>
      ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderAzkar = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Digital Tasbeeh</Text>
      {AZKAR_LIST.map((item) => {
        const isDone = counts[item.id] >= item.target;
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => handlePress(item.id, item.target)}
            onLongPress={() => setCounts({ ...counts, [item.id]: 0 })}
            style={[styles.zikrCard, isDone && styles.zikrCardDone]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.zikrTitle, isDone && { color: COLORS.white }]}>{item.title}</Text>
              <Text style={[styles.zikrSub, isDone && { color: COLORS.mint }]}>{item.text}</Text>
              <Text style={[styles.zikrTarget, isDone && { color: COLORS.white }]}>Target: {item.target}x</Text>
            </View>
            <View style={[styles.counter, isDone && styles.counterDone]}>
              {isDone ? (
                <MaterialCommunityIcons name="check-bold" size={28} color={COLORS.emerald} />
              ) : (
                <Text style={styles.counterText}>{counts[item.id]}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.logo}>Sunnah24</Text>
        <Text style={styles.tagline}>Reviving Prophetic Habits</Text>
      </View>

      <View style={{ flex: 1 }}>
        {tab === 'Timeline' && renderTimeline()}
        {tab === 'Duas' && renderDuas()}
        {tab === 'Azkar' && renderAzkar()}
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setTab('Timeline')} style={styles.navItem}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={24} color={tab === 'Timeline' ? COLORS.emerald : COLORS.silver} />
          <Text style={[styles.navText, tab === 'Timeline' && styles.navTextActive]}>Routine</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('Duas')} style={styles.navItem}>
          <MaterialCommunityIcons name="hands-pray" size={24} color={tab === 'Duas' ? COLORS.emerald : COLORS.silver} />
          <Text style={[styles.navText, tab === 'Duas' && styles.navTextActive]}>Duas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('Azkar')} style={styles.navItem}>
          <MaterialCommunityIcons name="dots-grid" size={24} color={tab === 'Azkar' ? COLORS.emerald : COLORS.silver} />
          <Text style={[styles.navText, tab === 'Azkar' && styles.navTextActive]}>Azkar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mint,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.emerald,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.silver,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.charcoal,
    marginBottom: 16,
    marginLeft: 4,
  },
  timelineCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.emerald,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  urduHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.emerald,
  },
  englishHeader: {
    fontSize: 14,
    color: COLORS.silver,
    fontWeight: '600',
  },
  arabicText: {
    fontSize: 22,
    color: COLORS.emerald,
    textAlign: 'right',
    lineHeight: 38,
    marginVertical: 8,
  },
  arabicTextLarge: {
    fontSize: 24,
    color: COLORS.emerald,
    textAlign: 'center',
    lineHeight: 44,
    marginVertical: 15,
  },
  urduText: {
    fontSize: 14,
    color: COLORS.charcoal,
    textAlign: 'right',
    lineHeight: 22,
  },
  descText: {
    fontSize: 14,
    color: COLORS.charcoal,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  duaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.mint,
    marginVertical: 12,
  },
  zikrCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  zikrCardDone: {
    backgroundColor: COLORS.emerald,
    borderColor: COLORS.emerald,
  },
  zikrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.emerald,
  },
  zikrSub: {
    fontSize: 11,
    color: COLORS.silver,
    marginVertical: 4,
  },
  zikrTarget: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gold,
  },
  counter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.mint,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.emerald,
  },
  counterDone: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.emerald,
  },
  navBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 30,
    backgroundColor: COLORS.white,
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 15,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.silver,
    marginTop: 4,
  },
  navTextActive: {
    color: COLORS.emerald,
  },
});
