import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ClinicFeatureList, HOURS_OPTIONS } from './Types/Clinic';

enum FilterBy {
  Main,
  Amenity,
  Hours,
  Distance,
}

type contentsType = {
  goBack: () => void;
  onSelect: (filterData: Record<string, string[]>) => void;
};

const MainContents: React.FC<mainContentsType> = ({
  setOption,
  filters,
  onSelect,
  clearFilters,
}) => {
  const hasFilter = (key: string) => filters[key]?.length > 0;

  const anyFiltersApplied = Object.values(filters).some(arr => arr.length > 0);

  const toggleBusy = () => {
    if (filters.busy?.length > 0) {
      onSelect({ busy: [] });
    } else {
      onSelect({ busy: ['4'] });
    }
  };

  const toggleIsOpenNow = () => {
    if (filters.openNow?.length > 0) {
      onSelect({ openNow: [] });
    } else {
      onSelect({ openNow: ['true'] });
    }
  };

  return (
    <View style={styles.contentsContainer}>
      <TouchableOpacity style={styles.buttonRow} onPress={toggleBusy}>
        <Ionicons
          name={filters.busy?.length > 0 ? 'checkmark-circle' : 'ban-outline'}
          size={22}
          color={filters.busy?.length > 0 ? '#28a745' : '#48e5c2'}
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Hide Busy GPs</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonRow} onPress={toggleIsOpenNow}>
        <Ionicons
          name={
            filters.openNow?.length > 0 ? 'checkmark-circle' : 'time-outline'
          }
          size={22}
          color={filters.openNow?.length > 0 ? '#28a745' : '#48e5c2'}
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Is Open</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonRow}
        onPress={() => setOption(FilterBy.Amenity)}>
        <Ionicons
          name="list-circle-outline"
          color="#48e5c2"
          size={22}
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Amenities</Text>
        {hasFilter('amenities') && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Applied</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonRow}
        onPress={() => setOption(FilterBy.Distance)}>
        <Ionicons
          name="location-outline"
          color="#48e5c2"
          size={22}
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Distance</Text>
        {hasFilter('distance') && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Applied</Text>
          </View>
        )}
      </TouchableOpacity>

      {anyFiltersApplied && (
        <TouchableOpacity
          style={styles.buttonRow}
          onPress={clearFilters}>
          <Ionicons
            name="trash-outline"
            size={22}
            color="#48e5c2"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Reset Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


const AmenityContents: React.FC<contentsType> = ({ goBack, onSelect }) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleFeature = (item: string) => {
    setSelectedFeatures((prev) => {
      const newSelection = prev.includes(item)
        ? prev.filter((feature) => feature !== item)
        : [...prev, item];
      onSelect({ amenities: newSelection });
      return newSelection;
    });
  };

  const renderItem = ({ item }: { item: string }) => {
    const selected = selectedFeatures.includes(item);
    return (
      <TouchableOpacity
        onPress={() => toggleFeature(item)}
        style={[styles.item, selected && styles.selectedItem]}>
        <Text style={[styles.itemText, selected && styles.selectedText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.contentsContainer}>
      <FlatList
        data={ClinicFeatureList}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        extraData={selectedFeatures}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const HoursContents: React.FC<contentsType> = ({ goBack, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSelect({ hours: [HOURS_OPTIONS[index]] });
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const isSelected = index === selectedIndex;
    return (
      <TouchableOpacity
        onPress={() => handleSelect(index)}
        style={[styles.item, isSelected && styles.selectedItem]}>
        <Text style={[styles.itemText, isSelected && styles.selectedText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.contentsContainer}>
      <FlatList
        data={HOURS_OPTIONS}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        extraData={selectedIndex}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const DistanceContents: React.FC<contentsType> = ({ goBack, onSelect }) => {
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  const distances = [
    { label: '1 km', value: 1 },
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
  ];

  const handleSelect = (value: number) => {
    setSelectedDistance(value);
    onSelect({ distance: [value.toString()] });
  };

  return (
    <View style={styles.contentsContainer}>
      {distances.map((distance) => (
        <TouchableOpacity
          key={distance.value}
          style={styles.buttonRow}
          onPress={() => handleSelect(distance.value)}
          activeOpacity={0.7}>
          <Ionicons
            name={
              selectedDistance === distance.value
                ? 'checkbox'
                : 'square-outline'
            }
            size={24}
            color="#48e5c2"
          />
          <Text style={styles.buttonText}>{distance.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

type FilterContentsProps = {
  onFiltersChange: (updatedFilters: Record<string, string[]>) => void;
  userFilters: Record<string, string[]>;
};

const FilterContents: React.FC<FilterContentsProps> = ({
  onFiltersChange,
  userFilters,
}) => {
  const [filterByOption, setFilterByOption] = useState<FilterBy>(FilterBy.Main);
  const [filters, setFilters] = useState<Record<string, string[]>>(userFilters);

  const GoBack = () => {
    setFilterByOption(FilterBy.Main);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const onSelectFilter = (data: Record<string, string[]>) => {
    const newFilters = { ...filters, ...data };
    // Remove any filters where array is empty
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key].length === 0) delete newFilters[key];
    });
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const renderFilterBy = () => {
    switch (filterByOption) {
      case FilterBy.Main:
        return (
          <MainContents
            setOption={setFilterByOption}
            filters={filters}
            clearFilters={clearFilters}
            onSelect={onSelectFilter}
          />
        );
      case FilterBy.Amenity:
        return <AmenityContents goBack={GoBack} onSelect={onSelectFilter} />;
      case FilterBy.Hours:
        return <HoursContents goBack={GoBack} onSelect={onSelectFilter} />;
      case FilterBy.Distance:
        return <DistanceContents goBack={GoBack} onSelect={onSelectFilter} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.titleContainer}>
        {filterByOption !== FilterBy.Main && (
          <TouchableOpacity onPress={GoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#48e5c2" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>
          {filterByOption === FilterBy.Main
            ? 'Filter Options'
            : filterByOption === FilterBy.Amenity
            ? 'Select Amenities'
            : filterByOption === FilterBy.Hours
            ? 'Select Hours'
            : 'Select Distance'}
        </Text>
      </View>
      {renderFilterBy()}
    </View>
  );
};

export default FilterContents;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
    maxHeight: '80%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentsContainer: {
    paddingTop: 10,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  selectedItem: {
    backgroundColor: '#48e5c2',
  },
  itemText: {
    fontSize: 16,
  },
  selectedText: {
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  badge: {
    marginLeft: 8,
    backgroundColor: '#48e5c2',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
});
