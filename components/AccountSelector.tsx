import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getColors } from '../src/constants/theme';
import { useTheme } from '../src/context/theme-context';
import financeIntegrationService from '../src/lib/services/finance-integration.service';

interface Prediction {
  account_id: string;
  account_code?: string;
  account_name?: string;
  account_type?: string;
  confidence?: number;
  confidence_score?: number;
  is_confirmed?: boolean;
  code?: string;
  name?: string;
}

interface XeroAccount {
  _id?: string;
  account_id: string;
  account_class?: string;
  account_type?: string;
  code: string;
  name: string;
  description?: string;
  status?: string;
  currency_code?: string;
  tax_type?: string;
}

interface AccountSelectorProps {
  value: string;
  onChange: (value: string, account?: Prediction) => void;
  predictions: Prediction[];
  placeholder?: string;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  value,
  onChange,
  predictions,
  placeholder = 'Select an account...',
}) => {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);

  const [selectedAccount, setSelectedAccount] = useState<XeroAccount | Prediction | null>(null);
  const [allAccounts, setAllAccounts] = useState<(XeroAccount | Prediction)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState<(XeroAccount | Prediction)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInProgressRef = useRef(false);

  const getDisplayText = (account: XeroAccount | Prediction): string => {
    if ('confidence_score' in account || 'confidence' in account) {
      return `${account.account_code || account.code || ''} - ${account.account_name || account.name || ''}`;
    } else {
      return `${account.code || ''} - ${account.name || ''}`;
    }
  };

  const getAccountCode = (account: XeroAccount | Prediction): string => {
    if ('confidence_score' in account || 'confidence' in account) {
      return account.account_code || account.code || '';
    } else {
      return account.code || '';
    }
  };

  const getAccountName = (account: XeroAccount | Prediction): string => {
    if ('confidence_score' in account || 'confidence' in account) {
      return account.account_name || account.name || '';
    } else {
      return account.name || '';
    }
  };

  const getAccountType = (account: XeroAccount | Prediction): string => {
    return account.account_type || '';
  };

  // Initialize with predictions
  useEffect(() => {
    setAllAccounts(predictions);
    if (!showDropdown) {
      setFilteredAccounts(predictions);
    }
  }, [predictions]);

  // Set selected account from value
  useEffect(() => {
    if (value) {
      const foundInPredictions = predictions.find(
        (p) => p.account_id === value
      );
      if (foundInPredictions) {
        setSelectedAccount(foundInPredictions);
        return;
      }

      const foundInAll = allAccounts.find(
        (a) =>
          ('account_id' in a && a.account_id === value) ||
          ('_id' in a && a._id === value)
      );
      if (foundInAll) {
        setSelectedAccount(foundInAll);
      }
    } else {
      setSelectedAccount(null);
    }
  }, [value, predictions, allAccounts]);

  // Search accounts
  const searchAccounts = useCallback(async (query: string) => {
    if (searchInProgressRef.current || !query || query.trim().length < 2) {
      return;
    }

    searchInProgressRef.current = true;
    setIsSearching(true);

    try {
      const results = await financeIntegrationService.searchAccounts(
        query.trim(),
        1,
        10
      );

      if (results.length > 0) {
        // Convert XeroAccount to Prediction format
        const accountPredictions: Prediction[] = results
          .filter((account: XeroAccount) => account.code && account.name && account.account_type)
          .map((account: XeroAccount) => ({
            account_id: account.account_id,
            account_code: account.code,
            account_name: account.name,
            account_type: account.account_type || '',
            confidence_score: 1.0,
            is_confirmed: false,
          }));

        // Filter matching predictions
        const validPredictions = predictions.filter(
          (p) => p && (p.account_name || p.name) && (p.account_code || p.code) && p.account_type
        );

        const matchingPredictions = validPredictions.filter((account) => {
          const searchText = query.toLowerCase();
          return (
            (account.account_name?.toLowerCase() || account.name?.toLowerCase() || '').includes(searchText) ||
            (account.account_code?.toLowerCase() || account.code?.toLowerCase() || '').includes(searchText) ||
            (account.account_type?.toLowerCase() || '').includes(searchText)
          );
        });

        const allResults = [...accountPredictions, ...matchingPredictions];
        const uniqueResults = allResults.filter(
          (account, index, self) =>
            index === self.findIndex((a) => a.account_id === account.account_id)
        );

        setFilteredAccounts(uniqueResults.slice(0, 10));
        setAllAccounts((prev) => {
          const combined = [...prev, ...uniqueResults];
          return combined.filter(
            (account, index, self) =>
              index === self.findIndex((a) => a.account_id === account.account_id)
          );
        });
      } else {
        // Fallback to local filtering
        const filtered = allAccounts.filter((account) => {
          const searchText = query.toLowerCase();
          if ('confidence_score' in account || 'confidence' in account) {
            return (
              (account.account_name?.toLowerCase() || account.name?.toLowerCase() || '').includes(searchText) ||
              (account.account_code?.toLowerCase() || account.code?.toLowerCase() || '').includes(searchText) ||
              (account.account_type?.toLowerCase() || '').includes(searchText)
            );
          } else {
            return (
              (account.name?.toLowerCase() || '').includes(searchText) ||
              (account.code?.toLowerCase() || '').includes(searchText) ||
              (account.account_type?.toLowerCase() || '').includes(searchText)
            );
          }
        });
        setFilteredAccounts(filtered.slice(0, 10));
      }
    } catch (error) {
      console.error('Error searching accounts:', error);
      // Fallback to local filtering
      const filtered = allAccounts.filter((account) => {
        const searchText = query.toLowerCase();
        if ('confidence_score' in account || 'confidence' in account) {
          return (
            (account.account_name?.toLowerCase() || account.name?.toLowerCase() || '').includes(searchText) ||
            (account.account_code?.toLowerCase() || account.code?.toLowerCase() || '').includes(searchText) ||
            (account.account_type?.toLowerCase() || '').includes(searchText)
          );
        } else {
          return (
            (account.name?.toLowerCase() || '').includes(searchText) ||
            (account.code?.toLowerCase() || '').includes(searchText) ||
            (account.account_type?.toLowerCase() || '').includes(searchText)
          );
        }
      });
      setFilteredAccounts(filtered.slice(0, 10));
    } finally {
      setIsSearching(false);
      searchInProgressRef.current = false;
    }
  }, [predictions, allAccounts]);

  // Handle search query changes with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!showDropdown) {
      return;
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchAccounts(searchQuery);
      }, 300);
    } else if (searchQuery.trim() === '') {
      setFilteredAccounts(predictions);
      setHighlightedIndex(0);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, showDropdown, searchAccounts, predictions]);

  // Initialize filtered accounts when dropdown opens
  useEffect(() => {
    if (showDropdown && filteredAccounts.length === 0 && !isSearching) {
      setFilteredAccounts(predictions);
      setHighlightedIndex(0);
    }
  }, [showDropdown, predictions, isSearching]);

  const handleAccountSelect = (account: XeroAccount | Prediction) => {
    setSelectedAccount(account);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    let predictionAccount: Prediction;
    if ('confidence_score' in account || 'confidence' in account) {
      predictionAccount = {
        ...account,
        is_confirmed: true,
      } as Prediction;
    } else {
      predictionAccount = {
        account_id: account.account_id,
        account_code: account.code,
        account_name: account.name,
        account_type: account.account_type || '',
        confidence_score: 1.0,
        is_confirmed: true,
      };
    }

    setShowDropdown(false);
    setIsSearching(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
    Keyboard.dismiss();
    onChange(predictionAccount.account_id, predictionAccount);
  };

  const handleSelectButtonClick = () => {
    if (showDropdown) {
      setShowDropdown(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
      Keyboard.dismiss();
    } else {
      setShowDropdown(true);
      setFilteredAccounts(predictions);
      setSearchQuery('');
      setHighlightedIndex(0);
    }
  };

  const getAccountTypeBadgeColor = (accountType: string): string => {
    const typeColors: { [key: string]: string } = {
      EXPENSE: colors.primary.DEFAULT,
      ASSET: colors.stats.green.text,
      LIABILITY: colors.status.rejected,
      CURRLIAB: '#f97316',
      DEPRECIATN: '#9333ea',
      FIXED: '#6366f1',
      OTHERINCOME: '#10b981',
      BANK: '#06b6d4',
      EQUITY: '#eab308',
    };
    return typeColors[accountType] || colors.text.secondary;
  };

  const aiPrediction = predictions.length > 0 ? predictions[0] : null;

  const renderAccountItem = ({ item, index }: { item: XeroAccount | Prediction; index: number }) => {
    const accountId = 'account_id' in item ? item.account_id : ('_id' in item ? item._id : '');
    const selectedAccountId = selectedAccount
      ? ('account_id' in selectedAccount ? selectedAccount.account_id : ('_id' in selectedAccount ? selectedAccount._id : ''))
      : null;
    const isSelected = accountId === selectedAccountId;
    const isHighlighted = index === highlightedIndex;
    const accountType = getAccountType(item);
    const typeColor = getAccountTypeBadgeColor(accountType);

    return (
      <TouchableOpacity
        style={[
          styles.accountOption,
          {
            backgroundColor: isSelected
              ? colors.primary.light + '20'
              : isHighlighted
              ? colors.background.DEFAULT
              : 'transparent',
            borderLeftWidth: isSelected ? 3 : 0,
            borderLeftColor: isSelected ? colors.primary.DEFAULT : 'transparent',
          },
        ]}
        onPress={() => handleAccountSelect(item)}
        activeOpacity={0.7}>
        <View style={styles.accountOptionContent}>
          <View style={styles.accountOptionLeft}>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountCode, { color: colors.text.primary }]}>
                {getAccountCode(item)}
              </Text>
              <Text style={[styles.accountName, { color: colors.text.secondary }]} numberOfLines={1}>
                {getAccountName(item)}
              </Text>
            </View>
          </View>
          <View style={styles.accountOptionRight}>
            {accountType && (
              <View style={[styles.accountTypeBadge, { backgroundColor: typeColor + '20' }]}>
                <Text style={[styles.accountTypeText, { color: typeColor }]}>
                  {accountType}
                </Text>
              </View>
            )}
            {isSelected && (
              <Ionicons name="checkmark-circle" size={20} color={colors.stats.green.text} />
            )}
          </View>
        </View>
        {('confidence_score' in item || 'confidence' in item) && (
          <View style={styles.confidenceContainer}>
            <Text style={[styles.confidenceText, { color: colors.text.muted }]}>
              Confidence: {typeof (item.confidence_score || item.confidence) === 'number' 
                ? `${((item.confidence_score || item.confidence || 0) * 100).toFixed(1)}%` 
                : 'N/A'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Select Button */}
      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            backgroundColor: colors.background.card,
            borderColor: showDropdown ? colors.primary.DEFAULT : colors.border.DEFAULT,
            borderWidth: showDropdown ? 2 : 1,
          },
        ]}
        onPress={handleSelectButtonClick}
        activeOpacity={0.7}>
        <View style={styles.selectButtonContent}>
          {selectedAccount ? (
            <View style={styles.selectedAccountInfo}>
              <Text style={[styles.selectedAccountCode, { color: colors.text.primary }]}>
                {getAccountCode(selectedAccount)}
              </Text>
              <Text style={[styles.selectedAccountName, { color: colors.text.secondary }]} numberOfLines={1}>
                {getAccountName(selectedAccount)}
              </Text>
            </View>
          ) : (
            <Text style={[styles.placeholderText, { color: colors.text.muted }]}>
              {placeholder}
            </Text>
          )}
          <Ionicons
            name={showDropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.text.secondary}
          />
        </View>
      </TouchableOpacity>

      {/* AI Prediction Info */}
      {aiPrediction && !selectedAccount && (
        <View style={[styles.aiPredictionBadge, { backgroundColor: colors.stats.green.bg }]}>
          <Ionicons name="sparkles" size={14} color={colors.stats.green.text} />
          <Text style={[styles.aiPredictionText, { color: colors.stats.green.text }]}>
            AI predicted: {aiPrediction.account_code || aiPrediction.code} - {aiPrediction.account_name || aiPrediction.name}
            {aiPrediction.confidence_score && (
              <Text style={{ opacity: 0.75 }}>
                {' '}({(aiPrediction.confidence_score * 100).toFixed(1)}%)
              </Text>
            )}
          </Text>
        </View>
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowDropdown(false);
          Keyboard.dismiss();
        }}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowDropdown(false);
            Keyboard.dismiss();
          }}>
          <View
            style={[styles.dropdownContainer, { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT }]}
            onStartShouldSetResponder={() => true}>
            {/* Search Input */}
            <View style={[styles.searchContainer, { borderBottomColor: colors.border.DEFAULT }]}>
              <Ionicons name="search" size={20} color={colors.text.secondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text.primary }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search accounts by name or code..."
                placeholderTextColor={colors.text.muted}
                autoFocus
              />
              {isSearching && (
                <ActivityIndicator size="small" color={colors.primary.DEFAULT} style={styles.searchLoader} />
              )}
            </View>

            {/* Selected Account Info */}
            {selectedAccount && (
              <View style={[styles.selectedInfoContainer, { backgroundColor: colors.background.DEFAULT, borderBottomColor: colors.border.DEFAULT }]}>
                <Text style={[styles.selectedInfoText, { color: colors.text.secondary }]}>
                  Currently selected:{' '}
                  <Text style={{ fontWeight: '600', color: colors.text.primary }}>
                    {getAccountCode(selectedAccount)} - {getAccountName(selectedAccount)}
                  </Text>
                </Text>
              </View>
            )}

            {/* Accounts List */}
            <FlatList
              data={filteredAccounts}
              renderItem={renderAccountItem}
              keyExtractor={(item, index) => {
                const accountId = 'account_id' in item ? item.account_id : ('_id' in item ? item._id : `account-${index}`);
                return `account-${accountId}-${index}`;
              }}
              style={styles.accountsList}
              contentContainerStyle={styles.accountsListContent}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                    {isSearching
                      ? 'Searching accounts...'
                      : searchQuery.length >= 2
                      ? `No accounts found matching "${searchQuery}"`
                      : 'No predictions available'}
                  </Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    selectButton: {
      borderRadius: 12,
      padding: 14,
      minHeight: 48,
    },
    selectButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    selectedAccountInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    selectedAccountCode: {
      fontSize: 15,
      fontWeight: '600',
    },
    selectedAccountName: {
      fontSize: 15,
      flex: 1,
    },
    placeholderText: {
      fontSize: 15,
      flex: 1,
    },
    aiPredictionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      marginTop: 8,
      gap: 6,
    },
    aiPredictionText: {
      fontSize: 12,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    dropdownContainer: {
      width: '100%',
      maxWidth: 500,
      maxHeight: '80%',
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      backgroundColor: colors.background.DEFAULT,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      padding: 0,
    },
    searchLoader: {
      marginLeft: 8,
    },
    selectedInfoContainer: {
      padding: 12,
      borderBottomWidth: 1,
    },
    selectedInfoText: {
      fontSize: 12,
    },
    accountsList: {
      maxHeight: 400,
    },
    accountsListContent: {
      paddingBottom: 8,
    },
    accountOption: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    accountOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    accountOptionLeft: {
      flex: 1,
    },
    accountInfo: {
      gap: 4,
    },
    accountCode: {
      fontSize: 15,
      fontWeight: '600',
    },
    accountName: {
      fontSize: 14,
    },
    accountOptionRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    accountTypeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    accountTypeText: {
      fontSize: 11,
      fontWeight: '600',
    },
    confidenceContainer: {
      marginTop: 8,
    },
    confidenceText: {
      fontSize: 12,
    },
    emptyContainer: {
      padding: 32,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      textAlign: 'center',
    },
  });

export default AccountSelector;

