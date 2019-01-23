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
import { CharitySearch } from './app/views/CharitySearch';
import { Charity } from './app/views/Charity';

const AppRoutes = createStackNavigator(
  {
    Home, TablesList, TableCreate, Rankings, CharitySearch, Charity,
    Table: {
      screen: Table,
      navigationOptions: ({ navigation }) => ({
        title: `${
          navigation.state.params.table.name.length > 16 ? 
          navigation.state.params.table.name.substring(0, 16) + '...' :
          navigation.state.params.table.name            
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