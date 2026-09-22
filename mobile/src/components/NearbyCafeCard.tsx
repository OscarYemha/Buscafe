import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { CafeSummary } from '../types/CafeSummary';
import { formatDistance } from '../utils/distance';

type Props = {
    cafe: CafeSummary;
    onPress: () => void;
};

export default function NearbyCafeCard({
    cafe,
    onPress,
}: Props) {
    const distanceLabel =
        formatDistance(cafe.distanceKm);

    const addressLabel =
        [
            cafe.shortAddress,
            cafe.neighborhood,
            cafe.city,
        ]
            .filter(Boolean)
            .join(' · ');

    const priceLabel =
        cafe.priceLevel !== null
            ? '$'.repeat(cafe.priceLevel)
            : 'Precio no disponible';

    const openLabel =
        cafe.isOpen === null
            ? 'Horario no disponible'
            : cafe.isOpen
                ? 'Abierto'
                : 'Cerrado';

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.name}>
                {cafe.name}
            </Text>

            <Text style={styles.address}>
                {addressLabel}
            </Text>

            <View style={styles.ratings}>
                <Text style={styles.rating}>
                    {cafe.googleRating !== null
                        ? `Google ★ ${cafe.googleRating}`
                        : 'Google · Sin valoración'}
                </Text>

                <Text style={styles.buscafeRating}>
                    {cafe.buscafeRating !== null
                        ? `BusCafé ★ ${cafe.buscafeRating.toFixed(1)}`
                        : 'BusCafé · Sin valoraciones'}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.info}>
                    {distanceLabel}
                </Text>

                <Text style={styles.info}>
                    {priceLabel}
                </Text>
            </View>

            <Text
                style={[
                    styles.status,
                    cafe.isOpen === true
                        ? styles.open
                        : cafe.isOpen === false
                            ? styles.closed
                            : styles.unknown,
                ]}
            >
                {openLabel}
            </Text>
        </TouchableOpacity>
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

    address: {
        marginTop: 6,
        fontSize: 13,
        color: '#7A6254',
    },

    ratings: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 12,
    },

    rating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7A6254',
    },

    buscafeRating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B3A22',
    },

    infoRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 10,
    },

    info: {
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

    unknown: {
        color: '#7A6254',
    },
});