import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CANDIDATO, FOTOS } from '../config/candidato';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#10B981',
  secondary: '#F59E0B',
  dark: '#059669',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
};

const GALERIA = [
  { key: 'comicio', image: FOTOS.comicio, titulo: 'Comício', descricao: 'Falando para o povo na Praça Central' },
  { key: 'celebracao', image: FOTOS.celebracao, titulo: 'Celebração', descricao: 'Juntos com a militância' },
  { key: 'naRua', image: FOTOS.naRua, titulo: 'Na Rua', descricao: 'Corpo a corpo com o povo' },
  { key: 'plenario', image: FOTOS.plenario, titulo: 'Plenário', descricao: 'Defendendo seus direitos' },
];

interface Props {
  user: any;
  onLogout: () => void;
}

export default function ProfileScreen({ user, onLogout }: Props) {
  const [selectedImage, setSelectedImage] = useState<typeof GALERIA[0] | null>(null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header do Candidato */}
      <View style={styles.candidatoHeader}>
        <Image source={FOTOS.retrato} style={styles.candidatoFoto} />
        <View style={styles.numeroBadge}>
          <Text style={styles.numeroText}>47</Text>
        </View>
        <Text style={styles.candidatoNome}>{CANDIDATO.nome}</Text>
        <Text style={styles.candidatoCargo}>{CANDIDATO.cargo}</Text>
        <Text style={styles.candidatoSlogan}>"{CANDIDATO.slogan}"</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>20+</Text>
          <Text style={styles.statLabel}>Anos de experiência</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>47</Text>
          <Text style={styles.statLabel}>Projetos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>Compromisso</Text>
        </View>
      </View>

      {/* Galeria */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📸 Galeria da Campanha</Text>
        <View style={styles.galeriaGrid}>
          {GALERIA.map((item) => (
            <TouchableOpacity 
              key={item.key}
              style={styles.galeriaItem}
              onPress={() => setSelectedImage(item)}
            >
              <Image source={item.image} style={styles.galeriaImage} />
              <View style={styles.galeriaOverlay}>
                <Text style={styles.galeriaTitulo}>{item.titulo}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Info do Candidato */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Informações</Text>
        <View style={styles.infoCard}>
          <InfoRow icon="person" label="Nome Completo" value={CANDIDATO.nomeCompleto} />
          <InfoRow icon="briefcase" label="Profissão" value={CANDIDATO.profissao} />
          <InfoRow icon="school" label="Formação" value={CANDIDATO.formacao} />
          <InfoRow icon="location" label="Naturalidade" value={CANDIDATO.naturalidade} />
          <InfoRow icon="flag" label="Partido" value={CANDIDATO.partido} />
        </View>
      </View>

      {/* Perfil do Usuário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Seu Perfil</Text>
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@exemplo.com'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔗 Links Úteis</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Ionicons name="globe-outline" size={22} color={COLORS.primary} />
          <Text style={styles.linkText}>Site Oficial</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton}>
          <Ionicons name="logo-instagram" size={22} color={COLORS.primary} />
          <Text style={styles.linkText}>Instagram</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton}>
          <Ionicons name="logo-whatsapp" size={22} color={COLORS.primary} />
          <Text style={styles.linkText}>WhatsApp</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />

      {/* Modal de Imagem */}
      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalClose}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={32} color={COLORS.white} />
          </TouchableOpacity>
          {selectedImage && (
            <View style={styles.modalContent}>
              <Image 
                source={selectedImage.image} 
                style={styles.modalImage}
                resizeMode="contain"
              />
              <View style={styles.modalCaption}>
                <Text style={styles.modalTitulo}>{selectedImage.titulo}</Text>
                <Text style={styles.modalDescricao}>{selectedImage.descricao}</Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon as any} size={20} color={COLORS.primary} />
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  candidatoHeader: {
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  candidatoFoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  numeroBadge: {
    position: 'absolute',
    top: 140,
    right: width / 2 - 90,
    backgroundColor: COLORS.secondary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  numeroText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  candidatoNome: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },
  candidatoCargo: {
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 4,
  },
  candidatoSlogan: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
  },
  galeriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  galeriaItem: {
    width: (width - 52) / 2,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
  },
  galeriaImage: {
    width: '100%',
    height: '100%',
  },
  galeriaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
  },
  galeriaTitulo: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.dark,
    fontWeight: '500',
  },
  userCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  linkButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.dark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  modalContent: {
    width: width - 40,
  },
  modalImage: {
    width: '100%',
    height: width - 40,
    borderRadius: 16,
  },
  modalCaption: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalTitulo: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalDescricao: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 8,
  },
});
