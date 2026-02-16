import { useEffect, useState } from "react";
import { Button, Card, CardBody, Input, Chip } from "@heroui/react";
import {
  create,
  read,
  readAll,
  patch,
  remove,
  count,
  clearTable,
} from "../modules/storage";

// ============================================
// Example 1: Simple Todo App with Generic CRUD
// ============================================

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

export function TodoDemo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Load todos
  const loadTodos = async () => {
    setLoading(true);
    const data = await readAll<Todo>("todos");
    setTodos(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadTodos();
  }, []);

  // CREATE
  const addTodo = async () => {
    if (!newTitle.trim()) return;
    
    const todo: Todo = {
      id: `todo-${Date.now()}`,
      title: newTitle,
      completed: false,
      createdAt: new Date(),
    };
    
    await create<Todo>("todos", todo);
    setNewTitle("");
    await loadTodos();
  };

  // UPDATE (partial)
  const toggleTodo = async (id: string) => {
    const todo = await read<Todo>("todos", id);
    if (todo) {
      await patch<Todo>("todos", id, { completed: !todo.completed });
      await loadTodos();
    }
  };

  // DELETE
  const deleteTodo = async (id: string) => {
    await remove("todos", id);
    await loadTodos();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardBody>
        <h2 className="text-xl font-bold mb-4">Todo List (Generic CRUD)</h2>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New todo..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void addTodo()}
          />
          <Button color="primary" onPress={() => void addTodo()}>
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2 p-2 border rounded">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => void toggleTodo(todo.id)}
              />
              <span className={todo.completed ? "line-through" : ""}>
                {todo.title}
              </span>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onPress={() => void deleteTodo(todo.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Chip>Total: {todos.length}</Chip>
          <Chip color="success">
            Completed: {todos.filter(t => t.completed).length}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
}

// ============================================
// Example 2: User Profile Manager
// ============================================

type UserProfile = {
  userId: string;
  name: string;
  email: string;
  preferences: {
    theme: "light" | "dark";
    language: string;
    notifications: boolean;
  };
  lastLogin: Date;
};

export function UserProfileDemo() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const userId = "user-123"; // ตัวอย่าง

  useEffect(() => {
    void loadProfile();
    void loadAllUsers();
  }, []);

  const loadProfile = async () => {
    const data = await read<UserProfile>("userProfiles", userId);
    setProfile(data || null);
  };

  const loadAllUsers = async () => {
    const data = await readAll<UserProfile>("userProfiles");
    setUsers(data);
  };

  const createProfile = async () => {
    const newProfile: UserProfile = {
      userId,
      name: "John Doe",
      email: "john@example.com",
      preferences: {
        theme: "dark",
        language: "th",
        notifications: true,
      },
      lastLogin: new Date(),
    };
    
    await create<UserProfile>("userProfiles", newProfile);
    await loadProfile();
  };

  const updatePreferences = async (theme: "light" | "dark") => {
    if (!profile) return;
    
    await patch<UserProfile>("userProfiles", userId, {
      preferences: {
        ...profile.preferences,
        theme,
      },
    });
    
    await loadProfile();
  };

  return (
    <Card>
      <CardBody>
        <h2 className="text-xl font-bold mb-4">User Profile Manager</h2>
        
        {profile ? (
          <div className="space-y-4">
            <div>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Theme:</strong> {profile.preferences.theme}</p>
              <p><strong>Language:</strong> {profile.preferences.language}</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                color={profile.preferences.theme === "dark" ? "primary" : "default"}
                onPress={() => void updatePreferences("dark")}
              >
                Dark Theme
              </Button>
              <Button
                color={profile.preferences.theme === "light" ? "primary" : "default"}
                onPress={() => void updatePreferences("light")}
              >
                Light Theme
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p>No profile found</p>
            <Button color="primary" onPress={() => void createProfile()}>
              Create Profile
            </Button>
          </div>
        )}
        
        <div className="mt-4">
          <Chip>Total Users: {users.length}</Chip>
        </div>
      </CardBody>
    </Card>
  );
}

// ============================================
// Example 3: Notes App with Search and Filter
// ============================================

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  createdAt: Date;
  isPinned: boolean;
};

export function NotesDemo() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    void loadNotes();
  }, []);

  const loadNotes = async () => {
    const allNotes = await readAll<Note>("notes");
    setNotes(allNotes);
  };

  const filteredNotes = notes.filter((note) => {
    const matchSearch = !searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchColor = !selectedColor || note.color === selectedColor;
    
    return matchSearch && matchColor;
  });

  const addNote = async () => {
    const note: Note = {
      id: `note-${Date.now()}`,
      title: "New Note",
      content: "Click to edit...",
      tags: [],
      color: "blue",
      createdAt: new Date(),
      isPinned: false,
    };
    
    await create<Note>("notes", note);
    await loadNotes();
  };

  const togglePin = async (id: string) => {
    const note = await read<Note>("notes", id);
    if (note) {
      await patch<Note>("notes", id, { isPinned: !note.isPinned });
      await loadNotes();
    }
  };

  const deleteNote = async (id: string) => {
    await remove("notes", id);
    await loadNotes();
  };

  const clearAllNotes = async () => {
    if (confirm("Delete all notes?")) {
      await clearTable("notes");
      await loadNotes();
    }
  };

  const colors = ["blue", "green", "yellow", "red", "purple"];

  return (
    <Card>
      <CardBody>
        <h2 className="text-xl font-bold mb-4">Notes App</h2>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button color="primary" onPress={() => void addNote()}>
            New Note
          </Button>
          <Button color="danger" variant="flat" onPress={() => void clearAllNotes()}>
            Clear All
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={selectedColor === null ? "solid" : "flat"}
            onPress={() => setSelectedColor(null)}
          >
            All
          </Button>
          {colors.map((color) => (
            <Button
              key={color}
              size="sm"
              variant={selectedColor === color ? "solid" : "flat"}
              onPress={() => setSelectedColor(color)}
            >
              {color}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded border-2 border-${note.color}-500`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{note.title}</h3>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    isIconOnly
                    variant="light"
                    onPress={() => void togglePin(note.id)}
                  >
                    {note.isPinned ? "📌" : "📍"}
                  </Button>
                  <Button
                    size="sm"
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => void deleteNote(note.id)}
                  >
                    ×
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{note.content}</p>
              {note.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {note.tags.map((tag) => (
                    <Chip key={tag} size="sm">{tag}</Chip>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Chip>Total: {notes.length}</Chip>
          <Chip>Filtered: {filteredNotes.length}</Chip>
          <Chip color="warning">Pinned: {notes.filter(n => n.isPinned).length}</Chip>
        </div>
      </CardBody>
    </Card>
  );
}

// ============================================
// Example 4: Statistics Dashboard
// ============================================

export function StatsDashboard() {
  const [stats, setStats] = useState({
    todos: 0,
    users: 0,
    notes: 0,
    configs: 0,
    appStates: 0,
  });

  useEffect(() => {
    void loadStats();
  }, []);

  const loadStats = async () => {
    const [todosCount, usersCount, notesCount, configsCount, appStatesCount] = 
      await Promise.all([
        count("todos"),
        count("userProfiles"),
        count("notes"),
        count("config"),
        count("appState"),
      ]);
    
    setStats({
      todos: todosCount,
      users: usersCount,
      notes: notesCount,
      configs: configsCount,
      appStates: appStatesCount,
    });
  };

  return (
    <Card>
      <CardBody>
        <h2 className="text-xl font-bold mb-4">Database Statistics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(stats).map(([table, total]) => (
            <div key={table} className="p-4 border rounded text-center">
              <div className="text-3xl font-bold">{total}</div>
              <div className="text-sm text-gray-600 capitalize">{table}</div>
            </div>
          ))}
        </div>
        
        <Button
          color="primary"
          className="mt-4"
          onPress={() => void loadStats()}
        >
          Refresh Stats
        </Button>
      </CardBody>
    </Card>
  );
}

// ============================================
// Main Demo Component
// ============================================

export default function GenericCrudDemo() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Generic CRUD Examples</h1>
      
      <TodoDemo />
      <UserProfileDemo />
      <NotesDemo />
      <StatsDashboard />
      
      <Card>
        <CardBody>
          <h3 className="font-bold mb-2">📝 Note:</h3>
          <p className="text-sm text-gray-600">
            ตัวอย่างเหล่านี้ใช้ Generic CRUD functions (create, read, update, patch, remove, etc.)
            <br />
            ไม่ต้องสร้าง function เฉพาะสำหรับแต่ละ table - ใช้ generic functions ได้กับทุก table ทันที!
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
