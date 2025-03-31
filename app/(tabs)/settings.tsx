import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [calendarSynced, setCalendarSynced] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#cbd5e1', true: '#818cf8' }}
            thumbColor={notificationsEnabled ? '#6366f1' : '#f1f5f9'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calendar</Text>
        <TouchableOpacity
          style={[styles.button, calendarSynced && styles.buttonDisabled]}
          onPress={() => setCalendarSynced(true)}
          disabled={calendarSynced}
        >
          <Text style={[styles.buttonText, calendarSynced && styles.buttonTextDisabled]}>
            {calendarSynced ? 'Calendar Synced' : 'Sync Calendar'}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1e293b',
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  buttonTextDisabled: {
    color: '#94a3b8',
  },
});