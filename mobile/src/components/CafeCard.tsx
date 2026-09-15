import { StyleSheet, Text, View } from 'react-native';

import { Cafe } from '../types/Cafe';
import { CafeIntent } from '../types/CafeIntent';

type Props = {
  cafe: Cafe;
  selectedIntent: CafeIntent;
};

export default function CafeCard({ cafe, selectedIntent }: Props) {

    const matchesIntent = cafe.intents.includes(selectedIntent);

    const intentLabels: Record<CafeIntent, string> = {
        work: 'trabajar',
        date: 'una cita',
        study: 'estudiar',
        coffee: 'disfrutar un buen café',
        'pet-friendly': 'ir con mascota',
        food: 'comer algo',
    }
    
    const intentLabel = intentLabels[selectedIntent]

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{cafe.name}</Text>
      <Text style={
        matchesIntent
            ? styles.recommended
            : styles.notRecommended
        }
      >
           {matchesIntent
               ? `✓ Ideal para ${intentLabel}`
               : `✗ Quizás no es ideal para ${intentLabel}`}
        </Text>

      <View style={styles.infoRow}>
        <Text style={styles.rating}>★ {cafe.rating}</Text>

        <Text style={styles.distance}>
          {cafe.distanceKm} km
        </Text>

        <Text style={styles.price}>
          {'$'.repeat(cafe.priceLevel)}
        </Text>
      </View>

      <Text
        style={[
          styles.status,
          cafe.isOpen ? styles.open : styles.closed,
        ]}
      >
        {cafe.isOpen ? 'Abierto' : 'Cerrado'}
      </Text>

      <View style={styles.featuresContainer}>
        {cafe.features.map((feature) => (
          <View
            key={feature}
            style={styles.feature}
          >
            <Text style={styles.featureText}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E8D9C7',
    },

    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4A2416',
    },

    infoRow: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 14,
    },

    rating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A2416',
    },

    distance: {
        fontSize: 14,
        color: '#7A6254',
    },

    price: {
        fontSize: 14,
        color: '#7A6254',
    },

    status: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
    },

    open: {
        color: '#39734A',
    },

    closed: {
        color: '#A13D32',
    },

    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },

    feature: {
        backgroundColor: '#F3E4C8',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    featureText: {
        fontSize: 12,
        color: '#6B3A22',
    },

    recommended: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: '600',
        color: '#39734A',
    },

    notRecommended: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: '600',
        color: '#A13D32',
    }
});