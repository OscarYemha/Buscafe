import * as Location from 'expo-location';

export type UserLocation = {
  latitude: number;
  longitude: number;
};

export async function getCurrentLocation():
  Promise<UserLocation | null>
{
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    return null;
  }

  const location =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}