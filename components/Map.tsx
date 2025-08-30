import React, { useEffect, useRef, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  TextInput,
} from 'react-native';
import Clinics_coords from '../new_clinic.json';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Clinic, Hours } from './Types/Clinic';
import Modal from 'react-native-modal';
import GPDetails from './GPDetails';
import FilterContents from './FilterContents';

enum option {
  Filter,
  GP,
}

// Haversine formula to calculate distance between 2 lat/lng points
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const LATITUDE = -36.89614437791492;
const LONGITUDE = 174.81271314232896;

const Map = () => {
  const [GP, setGP] = useState<Clinic[]>([]);
  const [filterGP, setFilterGP] = useState<Clinic[]>([]);
  const [selectedGP, setSelectedGP] = useState<Clinic | null>(null);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [modalOption, setModalOption] = useState<option>(option.Filter);
  const [showSelection, setShowSelection] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    setGP(Clinics_coords);
  }, []);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      applyFilters();
    } else {
      setFilterGP(GP); // No filters, show all
    }
  }, [filters, GP]);

  // Helper function to check if a clinic is currently open
  const isOpenNow = (clinic: Clinic) => {
    if (!clinic.hours) return false;

    const now = new Date();
    const dayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const today = days[dayIndex];

    const todayHours = clinic.hours[today];
    if (!todayHours) return false;

    // Check for "closed" explicitly
    if (
      todayHours.open.toLowerCase() === 'closed' ||
      todayHours.close.toLowerCase() === 'closed'
    )
      return false;

    // Parse open and close times (format "HH:mm")
    const [openHour, openMinute] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);

    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Handle overnight closing (e.g. closes at 02:00)
    if (closeTime < openTime) {
      return currentTime >= openTime || currentTime <= closeTime;
    } else {
      return currentTime >= openTime && currentTime <= closeTime;
    }
  };

  const handleMarkerSelect = (clinic: Clinic) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: clinic.latitude - 0.0075,
          longitude: clinic.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  const HandleBottomView = (selectedOption?: option) => {
    if (selectedOption !== undefined) {
      setModalOption(selectedOption);
      setShowSelection(true);
    } else {
      setShowSelection(false);
    }
  };

  const renderModalContent = () => {
    switch (modalOption) {
      case option.Filter:
        return (
          <FilterContents
            onFiltersChange={handleApplyFilters}
            userFilters={filters}
          />
        );
      case option.GP:
        return selectedGP ? <GPDetails clinic={selectedGP} /> : null;
      default:
        return null;
    }
  };

  const handleApplyFilters = (appliedFilters: Record<string, string[]>) => {
    // Remove filters that are empty
    const cleaned = Object.fromEntries(
      Object.entries(appliedFilters).filter(([, val]) => val.length > 0)
    );
    setFilters(cleaned);
  };

  const countActiveFilters = (filters: Record<string, string[]>) => {
    return Object.values(filters).reduce((acc, val) => acc + val.length, 0);
  };

  const activeFilterCount = countActiveFilters(filters);

  const applyFilters = () => {
    let busyVal = 0;
    let distanceVal = 0;
    let amenitiesVal: string[] = [];
    let openNow = false;
    let times: string[] = [];

    if (filters.busy?.length > 0) {
      busyVal = parseInt(filters.busy[0]);
    }

    if (filters.distance?.length > 0) {
      distanceVal = parseInt(filters.distance[0]);
    }

    if (filters.amenities?.length > 0) {
      amenitiesVal = filters.amenities;
    }

    if (filters.hours?.length > 0) {
      times = filters.hours; // e.g. ["8:00am", "2:00pm"]
    }

    if (filters.openNow?.length > 0) {
      openNow = filters.openNow[0] === 'true';
    }

    const Filtered = GP.filter((clinic: Clinic) => {
      // Busy level filter
      if (busyVal > 0 && (clinic.busy ?? 0) >= busyVal) return false;

      // Distance filter
      if (distanceVal > 0) {
        const dist = haversineDistance(
          LATITUDE,
          LONGITUDE,
          clinic.latitude,
          clinic.longitude
        );
        if (dist > distanceVal) return false;
      }

      // Amenities filter
      if (
        amenitiesVal.length > 0 &&
        (!clinic.amenities ||
          !amenitiesVal.every((a) => clinic.amenities!.includes(a)))
      ) {
        return false;
      }

      // Time range filter (e.g. between 8:00am and 2:00pm)
      if (times.length === 2) {
        const now = new Date();
        const today = now.toLocaleDateString(undefined, { weekday: 'long' });
        const todayHours = clinic.hours?.[today];

        if (
          typeof todayHours === 'object' &&
          todayHours.opening &&
          todayHours.closing
        ) {
          const clinicOpening = parseTime(todayHours.opening);
          const clinicClosing = parseTime(todayHours.closing);
          const filterStart = parseTime(times[0]);
          const filterEnd = parseTime(times[1]);

          // Check if clinic is open during the given time window
          if (clinicClosing <= filterStart || clinicOpening >= filterEnd) {
            return false;
          }
        } else if (
          typeof todayHours === 'string' &&
          todayHours.toLowerCase() === 'closed'
        ) {
          return false;
        }
      }

      // "Open now" filter
      if (openNow && (!clinic.hours || !isClinicOpenNow(clinic))) {
        return false;
      }

      return true;
    });

    setFilterGP(Filtered);
  };

  const parseTime = (timeStr: string): Date => {
    const now = new Date();
    const [time, modifier] = timeStr.toLowerCase().split(/(am|pm)/);
    let [hours, minutes] = time.trim().split(':').map(Number);
    if (modifier === 'pm' && hours < 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;

    const result = new Date(now);
    result.setHours(hours, minutes || 0, 0, 0);
    return result;
  };

  const isClinicOpenNow = (clinic: Clinic): boolean => {
    const now = new Date();

    const today = now.toLocaleDateString(undefined, { weekday: 'long' });
    const todayHours = clinic.hours[today];

    if (!todayHours) return false;

    const openingStr = todayHours.opening?.trim().toLowerCase();
    const closingStr = todayHours.opening?.trim().toLowerCase();

    if (
      openingStr === '' ||
      closingStr === '' ||
      openingStr === 'open 24 hours' ||
      closingStr === 'open 24 hours'
    ) {
      return true;
    }

    const currentDate = now.toDateString();
    const openingTime = new Date(`${currentDate} ${clinic.hours.opening}`);
    const closingTime = new Date(`${currentDate} ${clinic.hours.closing}`);

    return now >= openingTime && now <= closingTime;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        {filterGP.map((clinic) => (
          <Marker
            key={clinic.url}
            coordinate={{
              latitude: clinic.latitude,
              longitude: clinic.longitude,
            }}
            onPress={() => {
              setSelectedGP(clinic);
              handleMarkerSelect(clinic);
              HandleBottomView(option.GP);
            }}>
            <Image
              style={styles.customMarker}
              source={require('../assets/seeGP3.png')}
            />
          </Marker>
        ))}
      </MapView>

      {/* Container for Search Bar + Filter Button */}
      <View style={styles.topRightContainer}>
        {/**
        <TextInput
          style={styles.searchInput}
          placeholder="Enter your address"
          value={searchAddress}
          onChangeText={setSearchAddress}
          returnKeyType="search"
          onSubmitEditing={() => {
            // TODO: Add address search/geocoding here
            console.log('Searching for:', searchAddress);
          }}
          clearButtonMode="while-editing"
        /> */}

        <TouchableOpacity
          style={[
            styles.menuButton,
            { backgroundColor: activeFilterCount > 0 ? '#48e5c2' : 'white' },
          ]}
          onPress={() => HandleBottomView(option.Filter)}>
          <Ionicons
            name="filter-outline"
            color={activeFilterCount > 0 ? 'white' : '#48e5c2'}
            size={25}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        style={styles.modal}
        isVisible={showSelection}
        onBackdropPress={() => HandleBottomView()}
        backdropOpacity={0.15}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeDirection="down"
        onSwipeComplete={() => HandleBottomView()}>
        {renderModalContent()}
      </Modal>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    width: 40,
    height: 40,
    borderColor: '#48e5c2',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  topRightContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  searchInput: {
    height: 50,
    width: 180,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    fontSize: 16,
  },
  menuButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  filterBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    zIndex: 11,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
