import { StyleSheet, Text, TextInput,TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamlist } from '../navigation/AppNavigator';
import { mockCafes } from '../data/mockCafes';

import { useReviewDraft } from '../context/ReviewDraftContext';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<
    RootStackParamlist,
    'AddReview'
>;

export default function AddReviewScreen({ route, navigation }: Props) {
    const { cafeId } = route.params;

    const cafe = mockCafes.find(
        (cafe) => cafe.id === cafeId
    );

    if (!cafe) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>
                    Cafetería no encontrada
                </Text>
            </SafeAreaView>
        );
    }

    const {draft, setDraft} = useReviewDraft();
    const {isAuthenticated} = useAuth();

    const isCurrentCafeDraft = draft.cafeId === cafe.id;

    const rating = isCurrentCafeDraft
        ? draft.rating
        : 0;

    const comment = isCurrentCafeDraft
        ? draft.comment
        : '';

    const canSubmit =
        rating > 0 && comment.trim().length > 0;

    const handleSubmit = () => {
        if (!canSubmit)
        {
            return;
        }

        if (!isAuthenticated)
        {
            navigation.navigate('Login');
            return;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>
                    Reseñar {cafe.name}
                </Text>

                <Text style={styles.description}>
                    Contanos cómo fue tu experiencia.
                </Text>
                <View style={styles.ratingSection}>
                    <Text style={styles.label}>
                        Tu valoración
                    </Text>

                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => 
                                    setDraft({
                                        cafeId: cafe.id,
                                        rating: star,
                                        comment: isCurrentCafeDraft
                                            ? draft.comment
                                            : '',
                                    })
                                }
                            >
                                <Text style={styles.star}>
                                    {star <= rating ? '★' : '☆'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.commentSection}>
                    <Text style={styles.label}>
                        Tu comentario
                    </Text>

                    <TextInput
                        style={styles.commentInput}
                        value={comment}
                        onChangeText={(text) =>
                            setDraft({
                                cafeId: cafe.id,
                                rating: isCurrentCafeDraft
                                    ? draft.rating
                                    : 0,
                                comment: text,
                            })
                        }
                        placeholder="Contanos qué te gustó o qué podría mejorar..."
                        placeholderTextColor="#9A8578"
                        multiline
                        maxLength={500}
                        textAlignVertical="top"
                    />

                    <Text style={styles.characterCount}>
                        {comment.length}/500
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !canSubmit && styles.submitButtonDisabled,
                        ]}
                        disabled={!canSubmit}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>
                            Publicar reseña
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        fontSize: 26,
        fontWeight: '700',
        color: '#4A2416',
    },

    description: {
        marginTop: 8,
        fontSize: 15,
        color: '#7A6254',
    },

    ratingSection: {
        marginTop: 28,
    },

    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4A2416',
    },

    starsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
    },

    star: {
        fontSize: 36,
        color: '#6B3A22',
    },

    commentSection: {
        marginTop: 28,
    },

    commentInput: {
        minHeight: 130,
        marginTop: 10,
        padding: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8D9C7',
        borderRadius: 14,
        fontSize: 15,
        color: '#4A2416',
    },

    characterCount: {
        marginTop: 6,
        textAlign: 'right',
        fontSize: 12,
        color: '#9A8578',
    },

    submitButton: {
        marginTop: 28,
        backgroundColor: '#6B3A22',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },

    submitButtonDisabled: {
        opacity: 0.4,
    },

    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});