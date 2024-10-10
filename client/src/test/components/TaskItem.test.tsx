import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TaskItem from '../../components/TaskItem';
import { ITask } from '../../types/Task';
import { TaskContext } from '../../contex/TaskContext';
import { Mock } from 'jest-mock';

const mockTask: ITask = {
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  priority: 'low',
  dueDate: new Date(),
  status: 'active',
  user: 'user-id',
};

const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();

describe('TaskItem Component', () => {
  const mockTaskContextValue = {
    tasks: [mockTask],
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: mockUpdateTask,
    deleteTask: mockDeleteTask,
    priorityFilter: 'todas',
    setPriorityFilter: jest.fn(),
    completionFilter: 'todas',
    setCompletionFilter: jest.fn(),
    searchTerm: '',
    setSearchTerm: jest.fn(),
  };

  it('should render task details', () => {
    render(
      <TaskContext.Provider value={mockTaskContextValue}>
        <TaskItem task={mockTask} onEdit={jest.fn()} />
      </TaskContext.Provider>
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should call updateTask when marking as completed', () => {
    render(
      <TaskContext.Provider value={mockTaskContextValue}>
        <TaskItem task={mockTask} onEdit={jest.fn()} />
      </TaskContext.Provider>
    );

    const completeButton = screen.getByRole('button', { name: /mark as completed/i });
    fireEvent.click(completeButton);

    expect(mockUpdateTask).toHaveBeenCalledWith({ ...mockTask, completed: true });
  });

  it('should call deleteTask when clicking delete button', () => {
    render(
      <TaskContext.Provider value={mockTaskContextValue}>
        <TaskItem task={mockTask} onEdit={jest.fn()} />
      </TaskContext.Provider>
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  it('should call onEdit when clicking the edit button', () => {
    const mockOnEdit = jest.fn();

    render(
      <TaskContext.Provider value={mockTaskContextValue}>
        <TaskItem task={mockTask} onEdit={mockOnEdit} />
      </TaskContext.Provider>
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });
});
