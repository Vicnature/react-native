import {Stack} from 'expo-router'
import {useCallback} from 'react'
import {useFonts} from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

// make splash screen visible when the app is initially launched
// SplashScreen.preventAutoHideAsync()

const Layout=()=>{
    const [fontsLoaded]=useFonts({
        'DMBold':require('../assets/fonts/DMSans-Bold.ttf'),
        'DMMedium':require('../assets/fonts/DMSans-Medium.ttf'),
        'DMRegular':require('../assets/fonts/DMSans-Regular.ttf'),
    })

    // show homescreen only if the home page has been loaded
    const onLayoutRootView=useCallback(async()=>{
        // if(fontsLoaded){
        //     await SplashScreen.hideAsync()
        // }
        // if(!fontsLoaded) return null
    },[fontsLoaded])
    return <Stack onLayout={onLayoutRootView}/>
}

export default Layout