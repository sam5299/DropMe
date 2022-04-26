import { NavigationContainer } from '@react-navigation/native';
import { Platform, StyleSheet, Text, View,StatusBar  } from 'react-native';
import BottomBar from './Component/BottomBar';


export default function App() {
  return (

      <>  
      <NavigationContainer>
      <BottomBar/>
      </NavigationContainer>

      </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:  Platform.OS ==="android"  ? StatusBar.currentHeight :0,
  },
});
