import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/Header';
import { TaskContext } from '../../contex/TaskContext';

describe('Header Component', () => {
  const mockSetSearchTerm = jest.fn();

  const mockTaskContextValue = {
    searchTerm: '',
    setSearchTerm: mockSetSearchTerm,
    tasks: [],
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    priorityFilter: 'todas',
    setPriorityFilter: jest.fn(),
    completionFilter: 'todas',
    setCompletionFilter: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the user name correctly', () => {
    const userName = 'Yefferson';

    render(
      <TaskContext.Provider value={mockTaskContextValue}>
        <Header userName={userName} />
      </TaskContext.Provider>
    );

    expect(
      screen.getByText((content, element) => {
        return content.includes('Faza sua Tarefa') && element?.textContent?.includes('Yefferson') || false;
      })
    ).toBeInTheDocument();
  });

  it('updates search term when typing in the input', () => {
    render(
      <TaskContext.Provider value={mockTaskContextValue}>
        <Header userName="Yefferson" />
      </TaskContext.Provider>
    );

    const input = screen.getByPlaceholderText(/Search for tasks/i);
    fireEvent.change(input, { target: { value: 'new task' } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('new task');
  });
});
