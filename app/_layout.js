

import { Stack } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { DrawerLayoutAndroid, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import { COLORS, icons } from "../constants";
import { ScreenHeaderBtn } from '../components';
import MenuOptions from "../components/home/drawer/drawer"; // Import your drawer menu options


const Layout = () => {
    const drawer = useRef(null);
    const [drawerOpenedState, setDrawerOpenedState] = useState(false);

    const onLayoutRootView = useCallback(async () => {
        // if (fontsLoaded) {
        //     await SplashScreen.hideAsync();
        // }
    }, []);

    const navigationView = () => (
        <View style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <MenuOptions handlePress={OpenAndCloseDrawer}/>
        </View>
    );

    // if (!fontsLoaded) return null;

    const OpenAndCloseDrawer=()=>{
        if (drawerOpenedState) {
            drawer.current.closeDrawer();
        } else {
            drawer.current.openDrawer();
        }
        setDrawerOpenedState(!drawerOpenedState);
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <DrawerLayoutAndroid
                ref={drawer}
                drawerWidth={300}
                renderNavigationView={navigationView}
            >
                <Stack
                    onLayout={onLayoutRootView}
                    screenOptions={{
                        headerLeft: () => (
                            <TouchableOpacity>
                                <ScreenHeaderBtn
                                    iconUrl={icons.menu}
                                    dimension="60%"
                                    handlePress={OpenAndCloseDrawer}
                                />
                            </TouchableOpacity>
                        ),
                        headerTitle: '',
                    }}
                />
            </DrawerLayoutAndroid>
        </GestureHandlerRootView>
    );
};

export default Layout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    navigationContainer: {
        backgroundColor: '#ecf0f1',
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: 'center',
    },
});
