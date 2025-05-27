import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';

interface Task {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  status: string | null;
  priority: string | null;
  is_completed: boolean | null;
  created_at: string;
  updated_at: string;
  list_id: number;
}

interface TaskListProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onTaskComplete: (taskId: number, isCompleted: boolean) => void;
  onDeleteTask: (taskId: number) => void;
  isLoading?: boolean;
}

type PriorityStyle = 'priorityhigh' | 'prioritymedium' | 'prioritylow';

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTaskPress, 
  onTaskComplete, 
  onDeleteTask,
  isLoading = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    
    const query = searchQuery.toLowerCase().trim();
    return tasks.filter(task => {
      const nameMatch = task.name.toLowerCase().includes(query);
      const descMatch = task.description?.toLowerCase().includes(query) || false;
      return nameMatch || descMatch;
    });
  }, [tasks, searchQuery]);

  const getPriorityStyle = (priority: string | null): PriorityStyle | undefined => {
    if (!priority) return undefined;
    return `priority${priority}` as PriorityStyle;
  };

  const handleDeletePress = (taskId: number, taskName: string) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteTask(taskId),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
          placeholderTextColor="#8E8E93"
        />
      </View>

      {filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery.trim() 
              ? "No tasks found matching your search."
              : "No tasks yet. Add a new task to get started!"}
          </Text>
        </View>
      ) : (
        filteredTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskItem}
            onPress={() => onTaskPress(task)}
          >
            <View style={styles.taskContent}>
              <TouchableOpacity
                style={[styles.checkbox, task.is_completed && styles.checkboxCompleted]}
                onPress={() => onTaskComplete(task.id, !task.is_completed)}
              />
              <View style={styles.taskInfo}>
                <Text style={[styles.taskName, task.is_completed && styles.taskCompleted]}>
                  {task.name}
                </Text>
                {task.description && (
                  <Text style={styles.taskDescription} numberOfLines={2}>
                    {task.description}
                  </Text>
                )}
                <View style={styles.taskMeta}>
                  {task.priority && (
                    <Text style={[styles.priority, styles[getPriorityStyle(task.priority) || 'prioritymedium']]}>
                      {task.priority}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePress(task.id, task.name)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priority: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  priorityhigh: {
    backgroundColor: '#FF3B30',
    color: 'white',
  },
  prioritymedium: {
    backgroundColor: '#FF9500',
    color: 'white',
  },
  prioritylow: {
    backgroundColor: '#34C759',
    color: 'white',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
}); 