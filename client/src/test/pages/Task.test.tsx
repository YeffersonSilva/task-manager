import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tasks from '../../pages/Tasks';
import { TaskContext } from '../../contex/TaskContext';
import { AuthContext } from '../../contex/AuthContext';
import { ITask } from '../../types/Task';
// import '@testing-library/jest-dom/extend-expect'; 

const mockTasks: ITask[] = [
  {
    _id: '1',
    title: 'Tarefa 1',
    description: 'Descrição da Tarefa 1',
    priority: 'low',
    completed: false,
    dueDate: new Date(),
    status: 'active',
    user: 'user-id',
  },
  {
    _id: '2',
    title: 'Tarefa 2',
    description: 'Descrição da Tarefa 2',
    priority: 'high',
    completed: true,
    dueDate: new Date(),
    status: 'active',
    user: 'user-id',
  },
];

const mockTaskContextValue = {
  tasks: mockTasks,
  fetchTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  priorityFilter: 'todas',
  setPriorityFilter: jest.fn(),
  completionFilter: 'todas',
  setCompletionFilter: jest.fn(),
  searchTerm: '',
  setSearchTerm: jest.fn(),
};

const mockAuthContextValue = {
  user: { name: 'Yefferson', email: 'yefferson@example.com' },
  logout: jest.fn(),
  setUser: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
};

describe('Tasks Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the user name correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <TaskContext.Provider value={mockTaskContextValue}>
          <Tasks />
        </TaskContext.Provider>
      </AuthContext.Provider>
    );
  
    expect(screen.getByRole('heading', { name: /Faza sua Tarefa/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Yefferson/i)[0]).toBeInTheDocument();
  });
  
  
  it('renders the list of tasks', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <TaskContext.Provider value={mockTaskContextValue}>
          <Tasks />
        </TaskContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
    expect(screen.getByText('Tarefa 2')).toBeInTheDocument();
  });

  it('opens the modal when the "Adicionar Tarefa" button is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <TaskContext.Provider value={mockTaskContextValue}>
          <Tasks />
        </TaskContext.Provider>
      </AuthContext.Provider>
    );

    const addButton = screen.getByRole('button', { name: /adicionar tarefa/i });
    fireEvent.click(addButton);

   
    const modalTitle = screen.getAllByText(/Adicionar Tarefa/i)[0];
    expect(modalTitle).toBeInTheDocument();
  });

  it('opens the modal for editing when a task item is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <TaskContext.Provider value={mockTaskContextValue}>
          <Tasks />
        </TaskContext.Provider>
      </AuthContext.Provider>
    );

 
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    
    const modalTitle = screen.getByText(/Editar Tarefa/i);
    expect(modalTitle).toBeInTheDocument();
  });

  it('filters tasks based on search term', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <TaskContext.Provider value={{ ...mockTaskContextValue, searchTerm: 'Tarefa 1' }}>
          <Tasks />
        </TaskContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
    expect(screen.queryByText('Tarefa 2')).toBeNull();
  });
});
