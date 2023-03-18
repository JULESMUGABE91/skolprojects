import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

import SplashScreen from '../screens/SplashScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import LoginScreen from '../screens/LoginScreen';
import StepOneScreen from '../screens/StepOneScreen';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomTab from './CustomTab';
import SettingScreen from '../screens/SettingScreen';
import {connect} from 'react-redux';
import MyAccountScreen from '../screens/MyAccountScreen';
import DrawerContent from './DrawerContent';
import {Loading} from '../components/Loading';
import OTPCodeScreen from '../screens/OTPCodeScreen';
import SurveyFormScreen from '../screens/SurveyFormScreen';
import SurveyPreviewScreen from '../screens/SurveyPreviewScreen';
import QuestionFormScreen from '../screens/QuestionFormScreen';
import SuccessScreen from '../screens/SuccessScreen';
import RewardScreen from '../screens/RewardScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StepTwoScreen from '../screens/StepTwoScreen';
import RwandaScreen from '../screens/RwandaScreen';
import SurveyHistoryScreen from '../screens/SurveyHistoryScreen';
import GiftScreen from '../screens/GiftScreen';
import NewGiftScreen from '../screens/NewGiftScreen';
import QRProfileScreen from '../screens/QRProfileScreen';
import ScanQRScreen from '../screens/ScanQRScreen';
import ProviderScreen from '../screens/ProviderScreen';
import NewProviderScreen from '../screens/NewProviderScreen';
import AccountScreen from '../screens/AccountScreen';
import AccountInfoScreen from '../screens/AccountInfoScreen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator();

const TabContainer = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
      })}
      tabBar={props => <CustomTab {...props} />}>
      <Tab.Screen
        name="Surveys"
        component={HomeScreen}
        screenOptions={({route}) => ({
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Zawadi"
        component={RewardScreen}
        screenOptions={({route}) => ({
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        screenOptions={({route}) => ({
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  );
};

const DrawerNavigator = props => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        options={{headerShown: false}}
        component={TabContainer}
      />
    </Drawer.Navigator>
  );
};

export const RootNavigator = props => {
  return (
    <NavigationContainer fallback={<Loading />}>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          options={{
            headerShown: false,
          }}
          component={SplashScreen}
        />
        <Stack.Screen
          name="OnBoard"
          options={{
            headerShown: false,
          }}
          component={OnBoardingScreen}
        />
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false,
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="OTPCode"
          options={{
            headerShown: false,
          }}
          component={OTPCodeScreen}
        />
        <Stack.Screen
          name="StepOne"
          options={{
            headerShown: false,
          }}
          component={StepOneScreen}
        />
        <Stack.Screen
          name="StepTwo"
          options={{
            headerShown: false,
          }}
          component={StepTwoScreen}
        />
        <Stack.Screen
          name="Rwanda"
          options={{
            headerShown: false,
          }}
          component={RwandaScreen}
        />
        <Stack.Screen
          name="Home"
          options={{
            headerShown: false,
          }}
          component={DrawerNavigator}
        />
        <Stack.Screen
          name="SurveyForm"
          options={{
            headerShown: false,
          }}
          component={SurveyFormScreen}
        />
        <Stack.Screen
          name="SurveyPreview"
          options={{
            headerShown: false,
          }}
          component={SurveyPreviewScreen}
        />
        <Stack.Screen
          name="QuestionForm"
          options={{
            headerShown: false,
          }}
          component={QuestionFormScreen}
        />
        <Stack.Screen
          name="Success"
          options={{
            headerShown: false,
          }}
          component={SuccessScreen}
        />
        <Stack.Screen
          name="Settings"
          options={{
            headerShown: false,
          }}
          component={SettingScreen}
        />
        <Stack.Screen
          name="MyAccount"
          options={{
            headerShown: false,
          }}
          component={MyAccountScreen}
        />
        <Stack.Screen
          name="Dashboard"
          options={{
            headerShown: false,
          }}
          component={DashboardScreen}
        />
        <Stack.Screen
          name="SurveyHistory"
          options={{
            headerShown: false,
          }}
          component={SurveyHistoryScreen}
        />
        <Stack.Screen
          name="Gifts"
          options={{
            headerShown: false,
          }}
          component={GiftScreen}
        />

        <Stack.Screen
          name="NewGift"
          options={{
            headerShown: false,
          }}
          component={NewGiftScreen}
        />

        <Stack.Screen
          name="QRProfile"
          options={{
            headerShown: false,
          }}
          component={QRProfileScreen}
        />
        <Stack.Screen
          name="ScanQR"
          options={{
            headerShown: false,
          }}
          component={ScanQRScreen}
        />
        <Stack.Screen
          name="Providers"
          options={{
            headerShown: false,
          }}
          component={ProviderScreen}
        />
        <Stack.Screen
          name="NewProvider"
          options={{
            headerShown: false,
          }}
          component={NewProviderScreen}
        />
        <Stack.Screen
          name="Accounts"
          options={{
            headerShown: false,
          }}
          component={AccountScreen}
        />
        <Stack.Screen
          name="AccountInfo"
          options={{
            headerShown: false,
          }}
          component={AccountInfoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = state => {
  const {theme} = state.Theme;
  return {theme};
};

export default connect(mapStateToProps)(RootNavigator);
