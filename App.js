// const AppRoutes = createStackNavigator(
//   {
//     HomeRoute: {
//       screen: Home
//     },
//     RandomRoute: {
//       screen: Random
//     }
//   },
//   {
//     initialRouteName: 'HomeRoute'
//   }
// );

import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Home } from './app/views/Home';
import { Table } from './app/views/Table';

const AppRoutes = createStackNavigator(
  {
    HomeRoute: {
      screen: Home
    },
    TableRoute: {
      screen: Table
    }
  },
  {
    initialRouteName: 'HomeRoute'
  }
);

const App = createAppContainer(AppRoutes);

export default App;