import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Clinic, Hours } from './Types/Clinic';

type GPDetailsProps = {
  clinic: Clinic;
};
 const distances = [
    { label: '1 km', value: 1 },
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
  ];

enum GPOptions {
  Main = 'Main',
  Details = 'Details',
  Hours = 'Open Hours',
  Amenities = 'Amenities',
  About = 'About',
}

const isClinicOpenNow = (hours: Hours): boolean => {
  const now = new Date();

  const today = now.toLocaleDateString(undefined, { weekday: 'long' });
  const todayHours = hours[today];

  if (!todayHours) return false;

if(todayHours !== "Closed")
  {
  const openingStr = todayHours.opening.trim().toLowerCase();
  const closingStr = todayHours.closing.trim().toLowerCase();

  if (
    openingStr === '' ||
    closingStr === '' ||
    openingStr === 'open 24 hours' ||
    closingStr === 'open 24 hours'
  ) {
    return true;
  }

  const currentDate = now.toDateString();
  const openingTime = new Date(`${currentDate} ${todayHours.opening}`);
  const closingTime = new Date(`${currentDate} ${todayHours.closing}`);
  
  return now >= openingTime && now <= closingTime;
  }
  return false;
};

type OptionProps = {
  clinic: Clinic;
  goBack: () => void;
};

const HoursTable: React.FC<OptionProps> = ({ clinic }) => {
  const hours = clinic.hours;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginVertical: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: '#ccc',
      paddingBottom: 4,
    },
    day: {
      fontWeight: 'bold',
      fontSize: 14,
      fontFamily: 'monospace',
      color: '#333',
    },
    time: {
      fontSize: 14,
      fontFamily: 'monospace',
      color: '#555',
    },
    noHours: {
      padding: 10,
      fontFamily: 'monospace',
      fontStyle: 'italic',
      color: '#888',
    },
  });
  if (!hours) {
    return <Text style={styles.noHours}>No hours available.</Text>;
  }

  const dayOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <View style={styles.container}>
      {dayOrder.map((day) => {
        const dayData = hours[day];

        return (
          <View key={day} style={styles.row}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.time}>
              {dayData === 'Closed'
                ? 'Closed'
                : `${dayData.opening} - ${dayData.closing}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const DetailsSection: React.FC<OptionProps> = ({ clinic }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      fontFamily: 'monospace',
      color: '#48e5c2',
      marginBottom: 10,
    },
    label: {
      fontWeight: 'bold',
      fontSize: 14,
      fontFamily: 'monospace',
      color: '#333',
      marginTop: 10,
    },
    value: {
      fontSize: 14,
      fontFamily: 'monospace',
      color: '#555',
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinic Details</Text>

      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>{clinic.address}</Text>

      {clinic.phone && (
        <>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{clinic.phone}</Text>
        </>
      )}
    </View>
  );
};

const AboutSection: React.FC<OptionProps> = ({ clinic }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    paragraph: {
      fontSize: 14,
      color: '#333',
      marginBottom: 10,
      lineHeight: 20,
      fontFamily: 'monospace',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      fontFamily: 'monospace',
      color: '#48e5c2',
      marginBottom: 10,
    },
  });

  if (!clinic.about || clinic.about.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>No information available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About This Clinic</Text>
      <ScrollView style={{ flex: 1, marginBottom: 10 }}>
        {clinic.about.map((paragraph, idx) => (
          <Text key={idx} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const AmenitiesSection: React.FC<OptionProps> = ({ clinic }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#48e5c2',
      fontFamily: 'monospace',
      marginBottom: 10,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    itemText: {
      fontSize: 14,
      color: '#333',
      fontFamily: 'monospace',
      marginLeft: 8,
    },
    noData: {
      fontStyle: 'italic',
      fontFamily: 'monospace',
      color: '#888',
    },
  });

  if (
    !clinic.amenities ||
    clinic.amenities.length === 0 ||
    clinic.amenities[0] === ''
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.noData}>No amenities listed for this clinic.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amenities</Text>
      {clinic.amenities.map((amenity, index) => (
        <View key={index} style={styles.itemRow}>
          <Ionicons name="checkmark-circle" size={18} color="#48e5c2" />
          <Text style={styles.itemText}>{amenity}</Text>
        </View>
      ))}
    </View>
  );
};

type MainProps = {
  clinic: Clinic;
  setOption: (newOption: GPOptions) => void;
};

const Main: React.FC<MainProps> = ({ clinic, setOption }) => {
  const open = isClinicOpenNow(clinic.hours);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '90%',
      padding: 10,
      backgroundColor: 'white',
      justifyContent: 'flex-start',
    },
    statusRow: {
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      fontWeight: 'bold',
      fontSize: 14,
      color: '#48e5c2',
      marginTop: 10,
    },
    value: {
      fontSize: 14,
      color: '#333',
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
      color: '#333',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, { color: open ? '#28a745' : '#dc3545' }]}>
          {open ? 'Open' : 'Closed'}
        </Text>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.label}>Availability:</Text>
        <Text
          style={[
            styles.value,
            { color: clinic.busy > 5 ? '#dc3545' : '#28a745' },
          ]}>
          {clinic.busy > 5 ? 'Busier' : 'Quieter'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.buttonRow}
        onPress={() => setOption(GPOptions.Amenities)}>
        <Ionicons
          name="list-circle-outline"
          color="#48e5c2"
          size={22}
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Amenities</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonRow}
        onPress={() => setOption(GPOptions.Hours)}>
        <Ionicons
          name="time-outline"
          color="#48e5c2"
          size={22}
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Hours</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonRow}
        onPress={() => setOption(GPOptions.About)}>
        <Ionicons
          name="information-circle-outline"
          color="#48e5c2"
          size={22}
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>About</Text>
      </TouchableOpacity>
    </View>
  );
};

const GPDetails: React.FC<GPDetailsProps> = ({ clinic }) => {
  const [selectedGPOption, setSelectedGPOption] = useState<GPOptions>(
    GPOptions.Main
  );

  const exitOption = () => {
    console.log('exitOption');
    setSelectedGPOption(GPOptions.Main);
  };

  const setOption = (newOption: GPOptions) => {
    setSelectedGPOption(newOption);
  };

  const renderGPOption = () => {
    switch (selectedGPOption) {
      case GPOptions.Details:
        return <DetailsSection clinic={clinic} goBack={exitOption} />;
      case GPOptions.Amenities:
        return <AmenitiesSection clinic={clinic} goBack={exitOption} />;
      case GPOptions.Hours:
        return <HoursTable clinic={clinic} goBack={exitOption} />;
      case GPOptions.About:
        return <AboutSection clinic={clinic} goBack={exitOption} />;
      case GPOptions.Main:
      default:
        return <Main clinic={clinic} setOption={setOption} />;
    }
  };

  return (
    <View style={styles.modalContent}>
      <View
        style={[
          styles.titleContainer,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        ]}>
        {selectedGPOption !== GPOptions.Main && (
          <TouchableOpacity
            onPress={()=>{ exitOption(); }}
            style={{ position: 'absolute', left: 0, padding: 5 ,width:100,height:50}}>
            <Ionicons name="arrow-back" size={28} color="#48e5c2" />
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.GPName,
            {
              textAlign: 'center',
              flex: 1,
              // paddingHorizontal to ensure the text doesn't overlap with the button
              paddingHorizontal: 40,
              marginLeft:50
            },
          ]}>
          {clinic.name}
        </Text>
      </View>

      <View
        style={{
          width: '100%',
          height: '90%',
          flex: 1,
        }}>
        {renderGPOption()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'flex-start',
  },
  titleContainer: {
    width: '100%',
    paddingTop: 10,
    marginBottom: 5,
    justifyContent:'space-between'
  },
  GPName: {
    fontFamily: 'monospace',
    color: '#48e5c2',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 5,
  },
});

export default GPDetails;
