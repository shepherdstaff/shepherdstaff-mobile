import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useMenteeStore } from '@/store/menteeStore';
import { format } from 'date-fns';
import { Check, X, Clock } from 'lucide-react-native';

export default function MenteesScreen() {
  const mentees = useMenteeStore((state) => state.mentees);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} color="#eab308" />;
      case 'rejected':
        return <X size={20} color="#ef4444" />;
      case 'completed':
        return <Check size={20} color="#22c55e" />;
      default:
        return null;
    }
  };

  const renderMentee = ({ item: mentee }) => (
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
      <FlatList
        data={mentees}
        renderItem={renderMentee}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
});