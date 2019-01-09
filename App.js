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
import { TablesList } from './app/views/TablesList';

const AppRoutes = createStackNavigator(
  {
    Home, Table, TablesList
  },
  {
    initialRouteName: 'Home'
  }
);

const App = createAppContainer(AppRoutes);

export default App;