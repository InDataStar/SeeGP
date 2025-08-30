 // const navigation = useNavigation();
  // const [index, setIndex] = useState(0);
  // const fadeAnim = useState(new Animated.Value(1))[0];
  // const slideAnim = useState(new Animated.Value(0))[0];

  // const goToMain = useCallback(() => {
  //   navigation.navigate('Menu');
  // }, [navigation]);

  // // useEffect(() => {
  // //   const timeOut = setTimeout(() => {
  // //     //goToMain();
  // //   }, 2000);
  // // }, []);


  // useEffect(() => {
  //   let count = 0;

  //   const interval = setInterval(() => {
  //     // Animate out: fade + slide left
  //     Animated.parallel([
  //       Animated.timing(fadeAnim, {
  //         toValue: 0,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(slideAnim, {
  //         toValue: -150, // slide left
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //     ]).start(() => {
  //       setIndex((prevIndex) => {
  //         const nextIndex = (prevIndex + 1) % rotateList.length;
  //         count++;
  //         if (count > rotateList.length -2) {
  //           clearInterval(interval);
  //           goToMain(); // navigate after last transition
  //         }
  //         return nextIndex;
  //       });

  //       // Reset slide to right side for new entry
  //       slideAnim.setValue(150);

  //       // Animate in: fade + slide in from right
  //       Animated.parallel([
  //         Animated.timing(fadeAnim, {
  //           toValue: 1,
  //           duration: 300,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(slideAnim, {
  //           toValue: 0,
  //           duration: 300,
  //           useNativeDriver: true,
  //         }),
  //       ]).start();
  //     });
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, [fadeAnim, slideAnim, goToMain]);



    //     <FontAwesome name={Current.icon} size={75} color="white" />
    //     </Animated.View>
    //   </LinearGradient>
    //   <Text
    //     style={[styles.titleText,{
    //       color: Current.color,
    //     }]}>
    //     Mi Organizer
    //   </Text>
    //   <Animated.Text
    //           style={[
    //       styles.titleText,
    //       { color: Current.color, opacity: fadeAnim },
    //     ]}
    //   >
    //       {Current.name}
    //   </Animated.Text>


// const rotateList = [
//   { icon: 'list',name:'To do Tasks', gradient:['#000000', '#434343'],color: '#000000' },
//   { icon: 'tasks',name:'Goals', gradient:['#00c6ff','#0072ff' ],color: '#0072ff' },
//   { icon: 'superpowers',name:'Running', gradient:['#C02425', '#f64f59'],color: '#f64f59' },
//   { icon: 'user-o',name:'Personal Care', gradient:['#76b852', '#8DC26F'],color: '#8DC26F' },


  // const Current = rotateList[index];