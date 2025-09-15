import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {
  getGoogleOAuthRedirectUri,
  startGoogleOAuth,
} from '../../services/calendarApi';

export default function CalendarScreen() {
  const handleGoogleCalendarSync = async () => {
    try {
      const redirectUri = getGoogleOAuthRedirectUri();
      const link = await startGoogleOAuth(redirectUri);
      if (link) {
        Linking.openURL(link);
      } else {
        Alert.alert('Error', 'No link received from server.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start Google Calendar sync.');
      console.error('Error starting Google Calendar sync:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleCalendarSync}
      >
        <Text style={styles.buttonText}>Sync Google Calendar</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
