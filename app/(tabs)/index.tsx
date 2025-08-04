import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useMenteeStore } from '@/store/menteeStore';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Mentee } from '@/types/mentee';

export default function MenteesScreen() {
  const mentees = useMenteeStore((state) => state.mentees);
  const loading = useMenteeStore((state) => state.loading);
  const error = useMenteeStore((state) => state.error);
  const fetchMentees = useMenteeStore((state) => state.fetchMentees);

  const onRefresh = useCallback(() => {
    fetchMentees();
  }, [fetchMentees]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Ionicons name="time" size={20} color="#eab308" />;
      case 'rejected':
        return <Ionicons name="close" size={20} color="#ef4444" />;
      case 'completed':
        return <Ionicons name="checkmark" size={20} color="#22c55e" />;
      default:
        return null;
    }
  };

  const renderMentee = ({ item: mentee }: { item: Mentee }) => (
    <TouchableOpacity style={styles.menteeCard}>
      <View style={styles.menteeHeader}>
        <Image
          source={{ uri: mentee.photoUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d' }}
          style={styles.avatar}
        />
        <View style={styles.menteeInfo}>
          <Text style={styles.menteeName}>{mentee.name}</Text>
          <Text style={styles.lastMet}>
            Last met: {mentee.lastMeetingDate ? format(new Date(mentee.lastMeetingDate), 'MMM d, yyyy') : 'Never'}
          </Text>
        </View>
      </View>
      
      {mentee.nextRecommendedDate && (
        <View style={styles.recommendedDate}>
          <Text style={styles.recommendedLabel}>Next Meeting:</Text>
          <Text style={styles.recommendedTime}>
            {format(new Date(mentee.nextRecommendedDate), 'MMM d, yyyy h:mm a')}
          </Text>
          <View style={styles.statusContainer}>
            {getStatusIcon(mentee.meetings[mentee.meetings.length - 1]?.status)}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Mentees</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMentees}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {loading && mentees.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading mentees...</Text>
        </View>
      ) : (
        <FlatList
          data={mentees}
          renderItem={renderMentee}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={['#6366f1']}
              tintColor="#6366f1"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  list: {
    padding: 20,
  },
  menteeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menteeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  menteeInfo: {
    flex: 1,
  },
  menteeName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
    marginBottom: 4,
  },
  lastMet: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
  },
  recommendedDate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
  },
  recommendedLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
    marginRight: 8,
  },
  recommendedTime: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#475569',
  },
  statusContainer: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#dc2626',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
});