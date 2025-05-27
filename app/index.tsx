import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { TaskList } from '../components/TaskList';
import { ListSelector } from '../components/ListSelector';
import { TaskForm } from '../components/TaskForm';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { getTasksByListId, createTask, updateTask, deleteTask } from '../queries/tasks';
import { getAllLists, createList } from '../queries/lists';
import { Zocial } from '@expo/vector-icons';

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

interface List {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface TaskFormValues {
  name: string;
  description?: string | null;
  priority?: string | null;
}

const HomeScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (selectedListId) {
      loadTasks(selectedListId);
    }
  }, [selectedListId]);

  const loadLists = async () => {
    setIsLoadingLists(true);
    try {
      const listsData = await getAllLists();
      setLists(listsData);
      if (listsData.length > 0) {
        setSelectedListId(listsData[0].id);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
      Alert.alert('Error', 'Failed to load lists');
    } finally {
      setIsLoadingLists(false);
    }
  };

  const loadTasks = async (listId: number) => {
    setIsLoadingTasks(true);
    try {
      const tasksData = await getTasksByListId(listId);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleCreateList = async (name: string) => {
    setIsLoadingLists(true);
    try {
      const newList = await createList(name);
      const list = newList as unknown as List;
      setLists([...lists, list]);
      setSelectedListId(list.id);
    } catch (error) {
      console.error('Error creating list:', error);
      Alert.alert('Error', 'Failed to create list');
    } finally {
      setIsLoadingLists(false);
    }
  };

  const handleCreateTask = async (values: TaskFormValues) => {
    if (!selectedListId) return;
    
    setIsLoadingTasks(true);
    try {
      await createTask({
        name: values.name,
        description: values.description || undefined,
        priority: values.priority || undefined,
        list_id: selectedListId,
      });
      await loadTasks(selectedListId);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleUpdateTask = async (taskId: number, values: TaskFormValues) => {
    setIsLoadingTasks(true);
    try {
      await updateTask(taskId, {
        name: values.name,
        description: values.description || undefined,
        priority: values.priority || undefined,
      });
      if (selectedListId) {
        await loadTasks(selectedListId);
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setIsLoadingTasks(true);
    try {
      await deleteTask(taskId);
      if (selectedListId) {
        await loadTasks(selectedListId);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleTaskPress = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskComplete = async (taskId: number, isCompleted: boolean) => {
    setIsLoadingTasks(true);
    try {
      await updateTask(taskId, { is_completed: isCompleted });
      if (selectedListId) {
        await loadTasks(selectedListId);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update task status');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleSubmit = (values: TaskFormValues) => {
    if (editingTask) {
      handleUpdateTask(editingTask.id, values);
    } else {
      handleCreateTask(values);
    }
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <ListSelector
            lists={lists}
            selectedListId={selectedListId}
            onSelectList={setSelectedListId}
            onCreateList={handleCreateList}
            isLoading={isLoadingLists}
          />
          {showTaskForm ? (
            <TaskForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
              initialValues={editingTask || undefined}
            />
          ) : (
            <>
              <TaskList
                tasks={tasks}
                onTaskPress={handleTaskPress}
                onTaskComplete={handleTaskComplete}
                onDeleteTask={handleDeleteTask}
                isLoading={isLoadingTasks}
              />
            </>
          )}
        </View>
      </ScrollView>
      <FloatingActionButton onPress={handleAddTask} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});

export default HomeScreen;
