import { View, Text, StyleSheet } from 'react-native';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Text style={styles.subtitle}>Calendar sync coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
  },
});