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
import { TableCreate } from './app/views/TableCreate';
import { Rankings } from './app/views/Rankings';

const AppRoutes = createStackNavigator(
  {
    Home, TablesList, TableCreate, Rankings, 
    Table: {
      screen: Table,
      navigationOptions: ({ navigation }) => ({
        title: `${
          navigation.state.params.tableName.length > 16 ? 
          navigation.state.params.tableName.substring(0, 16) + '...' :
          navigation.state.params.tableName            
        }`
      })
    }
  },
  {
    initialRouteName: 'Home'
  }
);

const App = createAppContainer(AppRoutes);

export default App;