import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const hairImage = require('../assets/images/wilson2.jpg');
const API_KEY = 'sk-4a74a59f59d748bfa259fb0d95e6e5b8';

type TaskMap = { [task: string]: boolean };

type DayData = {
  date: Date;
  label?: string;
  image?: any;
  amTasks?: TaskMap;
  pmTasks?: TaskMap;
};

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function HairHealthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const today = normalizeDate(new Date());

  const [daysList, setDaysList] = useState<DayData[]>([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [hairHealthRating, setHairHealthRating] = useState(0);

  useEffect(() => {
    const newRating = Math.floor(Math.random() * (85 - 80 + 1)) + 70;
    setHairHealthRating(newRating);
  }, [selectedDate]);

  const totalCircles = 8;
  const greenCircles = Math.round((hairHealthRating / 100) * totalCircles);
  const circleRadius = 90;
  const circleSize = 40;

  const getDayData = (date: Date) =>
    daysList.find(d => d.date.getTime() === normalizeDate(date).getTime());

  const updateTask = (period: 'AM' | 'PM', task: string) => {
    setDaysList(prev =>
      prev.map(day => {
        if (day.date.getTime() !== selectedDate.getTime()) return day;
        const updatedTasks = {
          ...(period === 'AM' ? day.amTasks : day.pmTasks),
          [task]: !(period === 'AM' ? day.amTasks?.[task] : day.pmTasks?.[task]),
        };
        return {
          ...day,
          amTasks: period === 'AM' ? updatedTasks : day.amTasks,
          pmTasks: period === 'PM' ? updatedTasks : day.pmTasks,
        };
      })
    );
  };

  const getCarouselDays = () => {
    const days: DayData[] = [];
    for (let i = -2; i <= 2; i++) {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + i);
      const norm = normalizeDate(date);
      const match = getDayData(norm);
      days.push(match || { date: norm });
    }
    return days;
  };

  const getCircularPositions = (count: number, radius: number) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      positions.push({ left: radius + x - circleSize / 2, top: radius + y - circleSize / 2 });
    }
    return positions;
  };

  const circlePositions = getCircularPositions(totalCircles, circleRadius);
  const selectedDay = getDayData(selectedDate) || { date: selectedDate };

  const formatShortDate = (date: Date) =>
    date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', weekday: 'short' });

  const generateTwoWeekRoutine = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: `You're a hair care expert. Generate a 7-day hair care routine. Each day should include exactly 3 AM tasks and 3 PM tasks to improve scalp and hair health. Reply in this format (JSON only):

[
  {
    "am": ["Task 1", "Task 2", "Task 3"],
    "pm": ["Task A", "Task B", "Task C"]
  },
  ...
] (7 objects total)`
            }
          ],
        }),
      });

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;
      const match = raw.match(/\[.*\]/s);
      if (!match) throw new Error('No valid JSON array found.');
      const weeklyRoutines = JSON.parse(match[0]);

      const twoWeekDays: DayData[] = [];
      for (let i = 0; i < 14; i++) {
        const routine = weeklyRoutines[i % 7];
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        twoWeekDays.push({
          date: normalizeDate(date),
          label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : undefined,
          image: hairImage,
          amTasks: Object.fromEntries(routine.am.map((t: string) => [t, false])),
          pmTasks: Object.fromEntries(routine.pm.map((t: string) => [t, false])),
        });
      }

      setDaysList(twoWeekDays);
      setSelectedDate(today);
    } catch (err) {
      console.error('Failed to fetch routine:', err);
      Alert.alert('Error', 'Failed to generate routine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      <ScrollView style={styles.container} scrollEnabled={!loading}>
        <Image
          source={require('../assets/images/logo-removebg-preview.png')}
          style={styles.logo}
        />

        <View style={styles.carouselContainer}>
          {getCarouselDays().map((day, i) => {
            const isSelected = day.date.getTime() === selectedDate.getTime();
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dayItem, isSelected && styles.dayItemSelected]}
                onPress={() => !loading && setSelectedDate(day.date)}
              >
                <Text style={styles.dayLabel}>{day.label || ''}</Text>
                <Text style={styles.dayDate}>{formatShortDate(day.date)}</Text>
                {day.image ? (
                  <Image source={hairImage} style={styles.dayImage} />
                ) : (
                  <View style={[styles.dayImage, styles.dayImageBlank]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Routine</Text>

        <View style={styles.checklistContainer}>
          {['AM', 'PM'].map(period => (
            <View key={period} style={styles.checklistColumn}>
              <Text style={styles.periodLabel}>{period}</Text>
              {selectedDay[`${period.toLowerCase()}Tasks`] &&
              Object.keys(selectedDay[`${period.toLowerCase()}Tasks`]!).length > 0 ? (
                Object.entries(selectedDay[`${period.toLowerCase()}Tasks`]!).map(([task, done]) => (
                  <TouchableOpacity
                    key={task}
                    onPress={() => !loading && updateTask(period as 'AM' | 'PM', task)}
                    style={styles.taskRow}
                  >
                    <Ionicons name={done ? 'checkbox' : 'square-outline'} size={16} color="#fff" />
                    <Text style={styles.taskText}>{task}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No {period} routine</Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Hair Health Rating</Text>

        <View style={styles.circleWrapper}>
          {circlePositions.map((pos, i) => (
            <View
              key={i}
              style={[
                styles.circle,
                {
                  left: pos.left,
                  top: pos.top,
                  backgroundColor: i < greenCircles ? 'green' : 'red',
                },
              ]}
            />
          ))}
          <View style={styles.centerCircle}>
            <Text style={styles.centerText}>{hairHealthRating}%</Text>
          </View>
        </View>

        <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + 50 }]}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={generateTwoWeekRoutine}
            disabled={loading}
          >
            <Text style={styles.navButtonText}>Generate 2-week Routine</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} disabled={loading}>
            <Text style={styles.navButtonText}>Detailed Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} disabled={loading}>
            <Text style={styles.navButtonText}>Prediction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomBar}>
        {["d6o32ihe", "lvc7ixcb", "2imvjcv9", "u4hpo4rr"].map((id, i) => {
          const isActive = i === 2; // Make third icon yellow

          const icon = (
            <Image
              source={{
                uri: `https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WtJE5xb9RQ/${id}_expires_30_days.png`,
              }}
              resizeMode="stretch"
              style={{
                width: 34,
                height: 34,
                tintColor: isActive ? '#FFD700' : '#FFFFFF',
              }}
            />
          );

          const routes = ["/main", "/camera", "/progression", "/setting"];
          return (
            <TouchableOpacity key={i} onPress={() => router.push(routes[i])}>
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Generating routine...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1e1e1e', flex: 1,  paddingHorizontal: 16 },
  sectionTitle: { color: '#FFA500', fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 20, textAlign: 'center' },
  checklistContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 60, gap: 16 },
  checklistColumn: { flex: 1 },
  periodLabel: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  taskRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  taskText: { color: '#fff', marginLeft: 6, fontSize: 13 },
  emptyText: { color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: 8 },
  carouselContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dayItem: { width: 70, marginHorizontal: 6, alignItems: 'center', paddingVertical: 8 },
  dayItemSelected: { borderBottomWidth: 3, borderBottomColor: '#FFA500' },
  dayLabel: { color: '#fff', fontWeight: '600', marginBottom: 2 },
  dayDate: { color: '#aaa', fontSize: 12, marginBottom: 6 },
  dayImage: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#333' },
  dayImageBlank: { backgroundColor: 'transparent' },
  bottomButtonContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  navButton: { backgroundColor: '#2e2e2e', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 14 },
  navButtonText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  circleWrapper: { width: 180, height: 180, alignSelf: 'center', marginTop: 20, marginBottom: 30, position: 'relative' },
  circle: { width: 40, height: 40, borderRadius: 20, position: 'absolute' },
  centerCircle: { position: 'absolute', left: 60, top: 60, width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },
  centerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    paddingVertical: 19,
    paddingLeft: 45,
    paddingRight: 34,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  logo: {
    width: 180,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
});
