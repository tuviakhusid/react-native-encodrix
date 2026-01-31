import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Calendar, Filter, Search, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getColors } from '../src/constants/theme';
import { useTheme } from '../src/context/theme-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.9; // Increased to 90% of screen height

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  
  // Search
  searchQuery: string;
  onSearchChange: (text: string) => void;
  
  // Date Range
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  
  // Filter By Date Type
  filterByDate: 'processing_date' | 'issue_date';
  onFilterByDateChange: (type: 'processing_date' | 'issue_date') => void;
  
  // Status Filter
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

export default function FilterBottomSheet({
  visible,
  onClose,
  onApply,
  onReset,
  searchQuery,
  onSearchChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  filterByDate,
  onFilterByDateChange,
  selectedStatus,
  onStatusChange,
}: FilterBottomSheetProps) {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_MAX_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [tempFromDate, setTempFromDate] = useState<Date | null>(null);
  const [tempToDate, setTempToDate] = useState<Date | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: BOTTOM_SHEET_MAX_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: BOTTOM_SHEET_MAX_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleClose();
    setTimeout(() => onApply(), 250);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onReset();
  };

  const formatDateForInput = (dateString: string): Date => {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const formatDateForDisplay = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleFromDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowFromDatePicker(false);
      if (selectedDate && event.type !== 'dismissed') {
        onFromDateChange(formatDateForDisplay(selectedDate));
      }
    } else {
      // iOS - update temp date as user scrolls
      if (selectedDate) {
        setTempFromDate(selectedDate);
      }
    }
  };

  const handleToDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowToDatePicker(false);
      if (selectedDate && event.type !== 'dismissed') {
        onToDateChange(formatDateForDisplay(selectedDate));
      }
    } else {
      // iOS - update temp date as user scrolls
      if (selectedDate) {
        setTempToDate(selectedDate);
      }
    }
  };

  const handleFromDatePickerOpen = () => {
    setTempFromDate(formatDateForInput(fromDate));
    setShowFromDatePicker(true);
  };

  const handleFromDatePickerConfirm = () => {
    if (tempFromDate) {
      onFromDateChange(formatDateForDisplay(tempFromDate));
    }
    setShowFromDatePicker(false);
    setTempFromDate(null);
  };

  const handleToDatePickerOpen = () => {
    setTempToDate(formatDateForInput(toDate));
    setShowToDatePicker(true);
  };

  const handleToDatePickerConfirm = () => {
    if (tempToDate) {
      onToDateChange(formatDateForDisplay(tempToDate));
    }
    setShowToDatePicker(false);
    setTempToDate(null);
  };

  const statusOptions = [
    { value: null, label: 'All' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}>
      <TouchableOpacity
        style={styles.overlay}
        onPress={handleClose}
        activeOpacity={1}>
        <Animated.View
          style={[
            styles.overlayAnimated,
            {
              opacity,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          ]}
        />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: colors.background.card,
            borderColor: colors.border.DEFAULT,
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}>
        <SafeAreaView style={styles.safeAreaContainer} edges={['bottom']}>
          <View style={styles.dragHandleContainer}>
            <View
              style={[
                styles.dragHandle,
                { backgroundColor: colors.text.secondary },
              ]}
            />
          </View>

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Filter size={24} color={colors.text.primary} strokeWidth={2.5} />
              <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                Filters
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              activeOpacity={0.7}>
              <X size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}>
            
            {/* Search Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Search
              </Text>
              <View style={[styles.searchContainer, { backgroundColor: colors.background.DEFAULT, borderColor: colors.border.DEFAULT }]}>
                <Search size={20} color={colors.text.secondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text.primary }]}
                  placeholder="Search documents..."
                  placeholderTextColor={colors.text.muted}
                  value={searchQuery}
                  onChangeText={onSearchChange}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => onSearchChange('')}
                    activeOpacity={0.7}>
                    <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Date Type Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Filter By Date Type
              </Text>
              <View style={styles.dateTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.dateTypeOption,
                    {
                      backgroundColor: filterByDate === 'processing_date' 
                        ? colors.primary.DEFAULT 
                        : colors.background.DEFAULT,
                      borderColor: filterByDate === 'processing_date' 
                        ? colors.primary.DEFAULT 
                        : colors.border.DEFAULT,
                    },
                  ]}
                  onPress={() => onFilterByDateChange('processing_date')}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.dateTypeText,
                      {
                        color: filterByDate === 'processing_date' 
                          ? '#ffffff' 
                          : colors.text.primary,
                      },
                    ]}>
                    Processing Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.dateTypeOption,
                    {
                      backgroundColor: filterByDate === 'issue_date' 
                        ? colors.primary.DEFAULT 
                        : colors.background.DEFAULT,
                      borderColor: filterByDate === 'issue_date' 
                        ? colors.primary.DEFAULT 
                        : colors.border.DEFAULT,
                    },
                  ]}
                  onPress={() => onFilterByDateChange('issue_date')}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.dateTypeText,
                      {
                        color: filterByDate === 'issue_date' 
                          ? '#ffffff' 
                          : colors.text.primary,
                      },
                    ]}>
                    Issue Date
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Range Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Date Range
              </Text>
              <View style={styles.dateInputRow}>
                <View style={styles.dateInputWrapper}>
                  <Text style={[styles.dateLabel, { color: colors.text.secondary }]}>
                    From Date
                  </Text>
                  <TouchableOpacity
                    style={[styles.dateInputContainer, { backgroundColor: colors.background.DEFAULT, borderColor: colors.border.DEFAULT }]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      handleFromDatePickerOpen();
                    }}
                    activeOpacity={0.7}>
                    <Calendar size={18} color={colors.text.secondary} />
                    <Text style={[styles.dateInput, { color: colors.text.primary }]}>
                      {fromDate || 'YYYY-MM-DD'}
                    </Text>
                  </TouchableOpacity>
                  {showFromDatePicker && Platform.OS === 'ios' && (
                    <Modal
                      transparent
                      animationType="slide"
                      visible={showFromDatePicker}
                      onRequestClose={() => setShowFromDatePicker(false)}>
                      <View style={styles.datePickerModal}>
                        <View style={[styles.datePickerContainer, { backgroundColor: colors.background.card }]}>
                          <View style={styles.datePickerHeader}>
                            <TouchableOpacity
                              onPress={() => setShowFromDatePicker(false)}
                              style={styles.datePickerButton}>
                              <Text style={[styles.datePickerButtonText, { color: colors.primary.DEFAULT }]}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                            <Text style={[styles.datePickerTitle, { color: colors.text.primary }]}>
                              Select From Date
                            </Text>
                            <TouchableOpacity
                              onPress={handleFromDatePickerConfirm}
                              style={styles.datePickerButton}>
                              <Text style={[styles.datePickerButtonText, { color: colors.primary.DEFAULT }]}>
                                Done
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={tempFromDate || formatDateForInput(fromDate)}
                            mode="date"
                            display="spinner"
                            onChange={handleFromDateChange}
                            maximumDate={toDate ? formatDateForInput(toDate) : new Date()}
                            style={styles.datePicker}
                          />
                        </View>
                      </View>
                    </Modal>
                  )}
                  {showFromDatePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                      value={formatDateForInput(fromDate)}
                      mode="date"
                      display="default"
                      onChange={handleFromDateChange}
                      maximumDate={toDate ? formatDateForInput(toDate) : new Date()}
                    />
                  )}
                </View>
                <View style={styles.dateInputWrapper}>
                  <Text style={[styles.dateLabel, { color: colors.text.secondary }]}>
                    To Date
                  </Text>
                  <TouchableOpacity
                    style={[styles.dateInputContainer, { backgroundColor: colors.background.DEFAULT, borderColor: colors.border.DEFAULT }]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      handleToDatePickerOpen();
                    }}
                    activeOpacity={0.7}>
                    <Calendar size={18} color={colors.text.secondary} />
                    <Text style={[styles.dateInput, { color: colors.text.primary }]}>
                      {toDate || 'YYYY-MM-DD'}
                    </Text>
                  </TouchableOpacity>
                  {showToDatePicker && Platform.OS === 'ios' && (
                    <Modal
                      transparent
                      animationType="slide"
                      visible={showToDatePicker}
                      onRequestClose={() => setShowToDatePicker(false)}>
                      <View style={styles.datePickerModal}>
                        <View style={[styles.datePickerContainer, { backgroundColor: colors.background.card }]}>
                          <View style={styles.datePickerHeader}>
                            <TouchableOpacity
                              onPress={() => setShowToDatePicker(false)}
                              style={styles.datePickerButton}>
                              <Text style={[styles.datePickerButtonText, { color: colors.primary.DEFAULT }]}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                            <Text style={[styles.datePickerTitle, { color: colors.text.primary }]}>
                              Select To Date
                            </Text>
                            <TouchableOpacity
                              onPress={handleToDatePickerConfirm}
                              style={styles.datePickerButton}>
                              <Text style={[styles.datePickerButtonText, { color: colors.primary.DEFAULT }]}>
                                Done
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={tempToDate || formatDateForInput(toDate)}
                            mode="date"
                            display="spinner"
                            onChange={handleToDateChange}
                            minimumDate={fromDate ? formatDateForInput(fromDate) : undefined}
                            maximumDate={new Date()}
                            style={styles.datePicker}
                          />
                        </View>
                      </View>
                    </Modal>
                  )}
                  {showToDatePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                      value={formatDateForInput(toDate)}
                      mode="date"
                      display="default"
                      onChange={handleToDateChange}
                      minimumDate={fromDate ? formatDateForInput(fromDate) : undefined}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
              </View>
            </View>

            {/* Status Filter Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Status
              </Text>
              <View style={styles.statusContainer}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value || 'all'}
                    style={[
                      styles.statusOption,
                      {
                        backgroundColor: selectedStatus === option.value 
                          ? colors.primary.DEFAULT 
                          : colors.background.DEFAULT,
                        borderColor: selectedStatus === option.value 
                          ? colors.primary.DEFAULT 
                          : colors.border.DEFAULT,
                      },
                    ]}
                    onPress={() => onStatusChange(option.value)}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: selectedStatus === option.value 
                            ? '#ffffff' 
                            : colors.text.primary,
                        },
                      ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          </ScrollView>
          
          {/* Action Buttons - Fixed at bottom */}
          <View style={[styles.actionsContainer, { borderTopColor: colors.border.DEFAULT, backgroundColor: colors.background.card }]}>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.resetButton, { borderColor: colors.border.DEFAULT }]}
                onPress={handleReset}
                activeOpacity={0.7}>
                <Text style={[styles.resetButtonText, { color: colors.text.secondary }]}>
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: colors.primary.DEFAULT }]}
                onPress={handleApply}
                activeOpacity={0.8}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayAnimated: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: BOTTOM_SHEET_MAX_HEIGHT,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  safeAreaContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    flexShrink: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  dateTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTypeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputWrapper: {
    flex: 1,
    gap: 8,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  dateInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  actionsContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 0,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    minHeight: 70,
    position: 'relative',
    zIndex: 10,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  datePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  datePickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  datePicker: {
    height: 200,
  },
});

