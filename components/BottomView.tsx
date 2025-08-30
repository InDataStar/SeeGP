import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { ReactNode, useState } from 'react';

type BottomViewProps = {
  IsVisible: boolean;
  HandleBottomView: () => void;
  children: ReactNode; // Accept any JSX inside the modal
};

const BottomView: React.FC<BottomViewProps> = ({
  IsVisible,
  HandleBottomView,
  children,
}) => {
  const [SelectedState, setSelectedState] = useState(false);
  const [ReviewState, setReviewState] = useState(false);

  const SetSelected = () => {
    if (SelectedState) {
      setSelectedState(false);
    } else {
      setSelectedState(true);
    }
  };

  const SetReviewState = () => {
    setReviewState(true);
  };

  return (
    <>
      <Modal
        style={style.container}
        isVisible={IsVisible}
        onBackdropPress={() => {
          HandleBottomView();
        }}
        backdropOpacity={0} // Dim the background when modal is open
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeDirection="down"
        onSwipeComplete={() => {
          HandleBottomView();
        }}>
        <View style={style.content}>{children}</View>
      </Modal>
    </>
  );
};

const style = StyleSheet.create({
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  container: {
    justifyContent: 'flex-end', // Align the modal at the bottom
    margin: 0, // Remove default modal margins
    height: 200,
  },
  content: {
    height: '50%', // Adjust modal height
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position (x, y)
    shadowOpacity: 0.25, // Shadow transparency (0 to 1)
    shadowRadius: 3.84, // Shadow blur

    // Android shadow
    elevation: 5,
  },
  body: {
    height: '90%',
    width: '100%',
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  iconContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    margin: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position (x, y)
    shadowOpacity: 0.25, // Shadow transparency (0 to 1)
    shadowRadius: 3.84, // Shadow blur

    // Android shadow
    elevation: 5,
  },
});

export default BottomView;
