import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AdviceResponse = {
  summary: string;
  causes: string[];
  recommendations: string[];
  sourceNote: string;
};

export default function InfoScreen() {
  const { topic } = useLocalSearchParams();
  const router = useRouter();
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topic) return;

    fetch(`https://2503979c8bba.ngrok-free.app/api/ai/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userProfile: {
          age: 29,
          gender: 'female',
          location: 'Sydney',
          hair_type: 'curly, medium thickness',
          diet: 'vegetarian',
          stress_level: 'moderate',
        },
        topic,
        backgroundInfo:
          'Hair health is affected by lifestyle, diet, stress, environment, and habits.',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAdvice(data);
      })
      .catch((error) => {
        console.error(error);
        setAdvice(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [topic]);

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/main')}>
        <Ionicons name="arrow-back" size={24} color="#FFA500" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Topic Title */}
      <Text style={styles.heading}>{topic}</Text>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#4C8CF5" />
      ) : advice ? (
        <>
          <Section title="📝 Summary" content={advice.summary} />
          <Section title="⚠️ Possible Causes" content={advice.causes} isList />
          <Section title="✅ Recommendations" content={advice.recommendations} isList />
          <Section title="📚 Source" content={advice.sourceNote} />
        </>
      ) : (
        <Text style={styles.error}>Error retrieving advice.</Text>
      )}
    </ScrollView>
  );
}

function Section({
  title,
  content,
  isList = false,
}: {
  title: string;
  content: string | string[];
  isList?: boolean;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {isList && Array.isArray(content) ? (
        content.map((item, i) => (
          <Text key={i} style={styles.bullet}>
            • {item}
          </Text>
        ))
      ) : (
        <Text style={styles.sectionContent}>{content}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
    paddingTop: 60, // spacing from top
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#FFA500',
    fontSize: 16,
    marginLeft: 6,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 12,
  },
  sectionTitle: {
    color: '#FFA500',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 22,
  },
  bullet: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 4,
    paddingLeft: 8,
  },
  error: {
    color: 'tomato',
    fontSize: 16,
    marginTop: 12,
  },
});
