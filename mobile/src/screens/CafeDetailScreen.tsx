import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamlist } from "../navigation/AppNavigator";
import { mockCafes } from "../data/mockCafes";
import { cafeIntents } from "../data/cafeIntents";
import { priceLabels } from '../utils/price';
import { useReviews } from "../context/ReviewsContext";

type Props = NativeStackScreenProps<RootStackParamlist, 'CafeDetail'>;

export default function CafeDetailScreen({ route, navigation }: Props) 
{
    const { cafeId } = route.params;
    const { reviewsByCafe} = useReviews();

    const cafe = mockCafes.find(
        (cafe) => cafe.id === cafeId
    );

    if(!cafe)
    {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>
                    Cafetería no encontrada
                </Text>
            </SafeAreaView>
        );
    }

    const cafeIntentOptions = cafe.intents
        .map((intent) =>
            cafeIntents.find((option) => option.id === intent)
        )
        .filter((option) => option !== undefined);


    const priceLabel = priceLabels[cafe.priceLevel];

    const openDirections = () => {
        const address = encodeURIComponent(cafe.address);

        Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${address}`
        );
    };

    const newReviews = reviewsByCafe[cafe.id] ?? [];

    const allReviews = [
        ...newReviews,
        ...cafe.reviews,
    ]

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>
                    {cafe.name}
                </Text>

                <View style={styles.ratingsContainer}>
                    <View>
                        <Text style={styles.ratingLabel}>
                        Google
                        </Text>

                        <Text style={styles.ratingValue}>
                        ★ {cafe.googleRating} ({cafe.googleReviewsCount})
                        </Text>
                    </View>

                    <View>
                        <Text style={styles.ratingLabel}>
                        Comunidad Buscafé
                        </Text>

                        <Text style={styles.ratingValue}>
                        {cafe.buscafeRating !== null
                            ? `★ ${cafe.buscafeRating} (${cafe.buscafeReviewsCount})`
                            : 'Sin valoraciones'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.summary}>
                    Precios: {'$'.repeat(cafe.priceLevel)} · {priceLabel}
                </Text>

                <View style={styles.section}>
                    <Text
                    style={[
                        styles.status,
                        cafe.isOpen ? styles.open : styles.closed,
                    ]}
                    >
                    {cafe.isOpen ? '● Abierto' : '● Cerrado'}
                    </Text>

                    <Text style={styles.info}>
                    🕐 {cafe.hours}
                    </Text>

                    <Text style={styles.info}>
                    📏 {cafe.distanceKm} km
                    </Text>

                    <Text style={styles.info}>
                    📍 {cafe.address}
                    </Text>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                    Características
                    </Text>

                    <View style={styles.tagsContainer}>
                    {cafe.features.map((feature) => (
                        <View
                        key={feature}
                        style={styles.tag}
                        >
                        <Text style={styles.tagText}>
                            {feature}
                        </Text>
                        </View>
                    ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Ideal para
                    </Text>

                    <View style={styles.tagsContainer}>
                        {cafeIntentOptions.map((option) => (
                        <View
                            key={option.id}
                            style={styles.tag}
                        >
                            <Text style={styles.tagText}>
                            {option.icon} {option.label}
                            </Text>
                        </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Reseñas de BusCafé
                    </Text>

                    {allReviews.length > 0 ? (
                        allReviews.map((review) => (
                            <View
                                key={review.id}
                                style={styles.reviewCard}
                            >
                                <View style={styles.reviewHeader}>
                                    <Text style={styles.reviewUser}>
                                        {review.userName}
                                    </Text>

                                    <Text style={styles.reviewRating}>
                                        ★ {review.rating}
                                    </Text>
                                </View>

                                <Text style={styles.reviewComment}>
                                    {review.comment}
                                </Text>

                                <Text style={styles.reviewDate}>
                                    {review.date}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyReviews}>
                            Todavía no hay reseñas en BusCafé.
                        </Text>
                    )}
                </View>
                <TouchableOpacity style={styles.addReviewButton}>
                    <Text
                        style={styles.addReviewButtonText}
                        onPress={() =>
                            navigation.navigate('AddReview', {
                                cafeId: cafe.id,
                            })
                        }
                    >
                        ✍️ Escribir una reseña
                    </Text>
                </TouchableOpacity>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Contacto
                    </Text>

                    <View style={styles.contactContainer}>
                        {cafe.website && (
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() => Linking.openURL(cafe.website!)}
                            >
                                <Text style={styles.contactButtonText}>
                                    🌐 Sitio web
                                </Text>
                            </TouchableOpacity>
                        )}

                        {cafe.instagram && (
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() => Linking.openURL(cafe.instagram!)}
                            >
                                <Text style={styles.contactButtonText}>
                                    📷 Instagram
                                </Text>
                            </TouchableOpacity>
                        )}

                        {cafe.phone && (
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() => Linking.openURL(`tel:${cafe.phone}`)}
                            >
                                <Text style={styles.contactButtonText}>
                                    📞 Llamar
                                </Text>
                            </TouchableOpacity>
                        )}

                        {cafe.whatsapp && (
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() =>
                                    Linking.openURL(
                                        `https://wa.me/${cafe.whatsapp!.replace(/\D/g, '')}`
                                    )
                                }
                            >
                                <Text style={styles.contactButtonText}>
                                    💬 WhatsApp
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <TouchableOpacity 
                style={styles.directionsButton}
                onPress={openDirections}
                >
                    <Text style={styles.directionsButtonText}>
                        📍 Cómo llegar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F1E7',
        paddingHorizontal: 20,
    },

    title: {
        marginTop: 20,
        fontSize: 28,
        fontWeight: '700',
        color: '#4A2416',
    },

    summary: {
        marginTop: 8,
        fontSize: 16,
        color: '#7A6254',
    },

    section: {
        marginTop: 24,
    },

    sectionTitle: {
        marginBottom: 12,
        fontSize: 18,
        fontWeight: '700',
        color: '#4A2416',
    },

    status: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
    },

    open: {
        color: '#39734A',
    },

    closed: {
        color: '#A13D32',
    },

    info: {
        marginTop: 6,
        fontSize: 15,
        color: '#7A6254',
    },

    directionsButton: {
        marginTop: 24,
        backgroundColor: '#6B3A22',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },

    directionsButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    tag: {
        backgroundColor: '#F3E4C8',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    tagText: {
        fontSize: 13,
        color: '#6B3A22',
    },

    ratingsContainer: {
        flexDirection: 'row',
        gap: 28,
        marginTop: 16,
    },

    ratingLabel: {
        fontSize: 13,
        color: '#7A6254',
    },

    ratingValue: {
        marginTop: 4,
        fontSize: 16,
        fontWeight: '600',
        color: '#4A2416',
    },

    contactContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    contactButton: {
        backgroundColor: '#F3E4C8',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 9,
    },

    contactButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B3A22',
    },

    reviewCard: {
        marginBottom: 12,
        padding: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8D9C7',
    },

    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    reviewUser: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4A2416',
    },

    reviewRating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B3A22',
    },

    reviewComment: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 20,
        color: '#7A6254',
    },

    reviewDate: {
        marginTop: 8,
        fontSize: 12,
        color: '#9A8578',
    },

    emptyReviews: {
        fontSize: 14,
        color: '#7A6254',
    },

    scrollContent: {
        paddingBottom: 32,
    },

    addReviewButton: {
        alignSelf: 'flex-start',
        marginBottom: 14,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#F3E4C8',
    },

    addReviewButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B3A22',
    },
});