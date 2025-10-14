import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground">
        <header className="bg-primary text-primary-foreground p-4 shadow-md">
          <h1 className="text-2xl font-bold">CookBook App</h1>
        </header>
        <main className="py-8">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
        </main>
      </div>
      <Toaster richColors />
    </Router>
  );
}

export default App;