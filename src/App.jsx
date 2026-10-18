import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { FavoritesProvider } from './context/FavoritesProvider';
import { LanguageProvider } from './context/LanguageProvider';
import { CoinDetailPage } from './pages/CoinDetailPage';
import { ConverterPage } from './pages/ConverterPage';
import { GlobalPage } from './pages/GlobalPage';
import { LoginPage } from './pages/LoginPage';
import { MarketPage } from './pages/MarketPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PortfolioPage } from './pages/PortafolioPage';
import { RegisterPage } from './pages/RegisterPage';

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<MarketPage />} />
              <Route path="coin/:id" element={<CoinDetailPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="convertidor" element={<ConverterPage />} />
              <Route path="exchange" element={<Navigate to="/convertidor" replace />} />
              <Route path="global" element={<GlobalPage />} />
              <Route path="iniciar-sesion" element={<LoginPage />} />
              <Route path="registrarse" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
