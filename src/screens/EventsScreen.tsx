import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#10B981',
  secondary: '#F59E0B',
  dark: '#1E3A5F',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
};

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  participants: number;
  isConfirmed: boolean;
}

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Carreata Centro',
    description: 'Grande carreata pela cidade. Traga sua família!',
    date: '15 Fev',
    time: '14:00',
    location: 'Praça Central',
    type: '🚗 Carreata',
    participants: 45,
    isConfirmed: true,
  },
  {
    id: '2',
    title: 'Reunião de Coordenação',
    description: 'Planejamento da próxima semana de campanha.',
    date: '16 Fev',
    time: '19:00',
    location: 'Comitê Central',
    type: '📋 Reunião',
    participants: 12,
    isConfirmed: false,
  },
  {
    id: '3',
    title: 'Panfletagem na Feira',
    description: 'Distribuição de santinhos na feira da Zona Norte.',
    date: '18 Fev',
    time: '08:00',
    location: 'Feira da Zona Norte',
    type: '📄 Panfletagem',
    participants: 8,
    isConfirmed: false,
  },
  {
    id: '4',
    title: 'Comício Final',
    description: 'Grande comício de encerramento da campanha!',
    date: '01 Mar',
    time: '18:00',
    location: 'Praça da Matriz',
    type: '🎤 Comício',
    participants: 200,
    isConfirmed: false,
  },
];

interface Props {
  user: any;
}

export default function EventsScreen({ user }: Props) {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [filter, setFilter] = useState<'all' | 'confirmed'>('all');

  const handleConfirm = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          isConfirmed: !event.isConfirmed,
          participants: event.isConfirmed 
            ? event.participants - 1 
            : event.participants + 1,
        };
      }
      return event;
    }));
  };

  const filteredEvents = filter === 'confirmed'
    ? events.filter(e => e.isConfirmed)
    : events;

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventDate}>
        <Text style={styles.eventDateText}>{item.date.split(' ')[0]}</Text>
        <Text style={styles.eventMonth}>{item.date.split(' ')[1]}</Text>
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventType}>{item.type}</Text>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.eventMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.gray} />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={COLORS.gray} />
            <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color={COLORS.gray} />
            <Text style={styles.metaText}>{item.participants}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.confirmButton,
            item.isConfirmed && styles.confirmButtonActive
          ]}
          onPress={() => handleConfirm(item.id)}
        >
          <Ionicons 
            name={item.isConfirmed ? "checkmark-circle" : "add-circle-outline"} 
            size={18} 
            color={item.isConfirmed ? COLORS.white : COLORS.primary} 
          />
          <Text style={[
            styles.confirmButtonText,
            item.isConfirmed && styles.confirmButtonTextActive
          ]}>
            {item.isConfirmed ? 'Confirmado' : 'Confirmar presença'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eventos</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterButtonText,
            filter === 'all' && styles.filterButtonTextActive
          ]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'confirmed' && styles.filterButtonActive]}
          onPress={() => setFilter('confirmed')}
        >
          <Text style={[
            styles.filterButtonText,
            filter === 'confirmed' && styles.filterButtonTextActive
          ]}>
            Meus eventos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.eventsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyText}>
              {filter === 'confirmed' 
                ? 'Você ainda não confirmou presença em nenhum evento' 
                : 'Nenhum evento encontrado'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  eventsList: {
    padding: 16,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventDate: {
    width: 70,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  eventDateText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  eventMonth: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  eventInfo: {
    flex: 1,
    padding: 12,
  },
  eventType: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
    maxWidth: 100,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  confirmButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  confirmButtonTextActive: {
    color: COLORS.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
