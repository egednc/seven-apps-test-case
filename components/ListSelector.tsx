import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

interface List {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ListSelectorProps {
  lists: List[];
  selectedListId: number | null;
  onSelectList: (listId: number) => void;
  onCreateList: (name: string) => void;
  isLoading?: boolean;
}

export const ListSelector: React.FC<ListSelectorProps> = ({
  lists,
  selectedListId,
  onSelectList,
  onCreateList,
  isLoading = false,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listsContainer}>
        {lists.map((list) => (
          <TouchableOpacity
            key={list.id}
            style={[
              styles.listItem,
              selectedListId === list.id && styles.selectedListItem,
            ]}
            onPress={() => onSelectList(list.id)}
          >
            <Text
              style={[
                styles.listName,
                selectedListId === list.id && styles.selectedListName,
              ]}
            >
              {list.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {isCreating ? (
        <View style={styles.createListContainer}>
          <TextInput
            style={styles.input}
            value={newListName}
            onChangeText={setNewListName}
            placeholder="Enter list name"
            autoFocus
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsCreating(false);
                setNewListName('');
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={handleCreateList}
            >
              <Text style={[styles.buttonText, styles.createButtonText]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsCreating(true)}
        >
          <Text style={styles.addButtonText}>+ New List</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  listsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
  },
  selectedListItem: {
    backgroundColor: '#007AFF',
  },
  listName: {
    fontSize: 14,
    color: '#000000',
  },
  selectedListName: {
    color: '#FFFFFF',
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  createListContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  createButtonText: {
    color: '#FFFFFF',
  },
}); 