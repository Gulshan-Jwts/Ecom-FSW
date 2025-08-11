import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, } from 'react-native';
import Svg, { Path, Line, Rect, Circle } from 'react-native-svg';


const BottomNav = () => {
  const navItems = [
    { icon: <Svg width={24} height={24} viewBox="0 0 24 24" fill="#FBC886"><Path d="M3 10.5V21a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10.5L12 3l-9 7.5z" /><Rect x="7" y="14" width="10" height="9" rx="1" /></Svg>, label: 'Home', active: true },
    { icon: <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth={1}><Rect x="4" y="4" width="6" height="6" rx="1" /><Rect x="14" y="4" width="6" height="6" rx="1" /><Rect x="4" y="14" width="6" height="6" rx="1" /><Rect x="14" y="14" width="6" height="6" rx="1" /></Svg>, label: 'Categories' },
    { icon: <Svg width={16} height={16} viewBox="0 0 16 16" fill="#6b7280"><Path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" /></Svg>, label: 'Search' },
    { icon:       <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth={0.000}
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.28869 2.76282C1.41968 2.36986 1.84442 2.15749 2.23737 2.28848L2.50229 2.37678C2.51549 2.38118 2.52864 2.38557 2.54176 2.38994C3.16813 2.59871 3.69746 2.77513 4.11369 2.96876C4.55613 3.17459 4.94002 3.42968 5.23112 3.83355C5.52221 4.23743 5.64282 4.68229 5.69817 5.16711C5.75025 5.62321 5.75023 6.18117 5.7502 6.84142L5.7502 9.49999C5.7502 10.9354 5.7518 11.9365 5.85335 12.6919C5.952 13.4256 6.13245 13.8142 6.40921 14.091C6.68598 14.3677 7.07455 14.5482 7.80832 14.6468C8.56367 14.7484 9.56479 14.75 11.0002 14.75H18.0002C18.4144 14.75 18.7502 15.0858 18.7502 15.5C18.7502 15.9142 18.4144 16.25 18.0002 16.25H10.9453C9.57774 16.25 8.47542 16.25 7.60845 16.1335C6.70834 16.0125 5.95047 15.7536 5.34855 15.1516C4.74664 14.5497 4.48774 13.7918 4.36673 12.8917C4.25017 12.0248 4.25018 10.9225 4.2502 9.55487L4.2502 6.88303C4.2502 6.17003 4.24907 5.69826 4.20785 5.33726C4.16883 4.99541 4.10068 4.83052 4.01426 4.71062C3.92784 4.59072 3.79296 4.47392 3.481 4.3288C3.15155 4.17554 2.70435 4.02527 2.02794 3.79981L1.76303 3.7115C1.37008 3.58052 1.15771 3.15578 1.28869 2.76282Z"
          fill="#6b7280"
        />
        <Path
          d="M5.74512 5.99997C5.75008 6.25909 5.75008 6.53954 5.75007 6.84137L5.75006 9.49997C5.75006 10.9354 5.75166 11.9365 5.85321 12.6918C5.86803 12.8021 5.8847 12.9045 5.90326 13H16.0221C16.9815 13 17.4612 13 17.8369 12.7522C18.2126 12.5045 18.4016 12.0636 18.7795 11.1817L19.2081 10.1817C20.0176 8.29291 20.4223 7.3485 19.9777 6.67423C19.5331 5.99997 18.5056 5.99997 16.4507 5.99997H5.74512Z"
          fill="#6b7280"
        />
        <Path
          d="M7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H11C11.4142 8.25 11.75 8.58579 11.75 9C11.75 9.41421 11.4142 9.75 11 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9Z"
          fill="#ffffff"
        />
        <Path
          d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
          fill="#6b7280"
        />
        <Path
          d="M18 19.5001C18 18.6716 17.3284 18.0001 16.5 18.0001C15.6716 18.0001 15 18.6716 15 19.5001C15 20.3285 15.6716 21.0001 16.5 21.0001C17.3284 21.0001 18 20.3285 18 19.5001Z"
          fill="#6b7280"
        />
      </Svg>, label: 'Cart' },
    { icon: <Svg width={16} height={16} viewBox="0 0 16 16" fill="#6b7280"><Path fillRule="evenodd" d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003zM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461z" /></Svg>, label: 'My Orders' },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.navItem}>
          <View style={[styles.navIcon, item.active && styles.activeIcon]}>{item.icon}</View>
          <Text style={[styles.navLabel, item.active && styles.activeLabel]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  bottomNav: { 
    position: 'absolute', 
    bottom: 0, 
    width: Dimensions.get('window').width, 
    maxWidth: 500, 
    backgroundColor: '#ffffff', 
    borderTopWidth: 1, 
    borderColor: '#e5e7eb', 
    flexDirection: 'row', 
    height: 64, 
    alignSelf: 'center' 
  },
  navItem: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 4 
  },
  navIcon: { 
    width: 24, 
    height: 24 
  },
  activeIcon: { 
    color: '#FBC886' 
  },
  navLabel: { 
    fontSize: 12, 
    fontWeight: '500', 
    color: '#6b7280' 
  },
  activeLabel: { 
    color: '#FBC886' 
  },
});
